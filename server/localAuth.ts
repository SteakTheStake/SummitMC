import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  const sessionSecret = process.env.SESSION_SECRET || "dev-secret-key-change-in-production";
  
  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  try {
    app.set("trust proxy", 1);
    app.use(getSession());
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure local strategy
    passport.use(new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        // For admin users, check password
        if (!user.isAdmin) {
          return done(null, false, { message: "Admin access required" });
        }

        // Verify password (empty password allowed for existing OAuth users during transition)
        if (user.password && user.password !== "") {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid username or password" });
          }
        } else {
          // For users without password set, accept any password temporarily
          // In production, you'd want to force password setup
          console.log("User has no password set, allowing access");
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));

    passport.serializeUser((user: any, cb) => cb(null, user.id));
    passport.deserializeUser(async (id: any, cb) => {
      try {
        const user = await storage.getUser(id);
        cb(null, user);
      } catch (error) {
        cb(error);
      }
    });

    // Login route
    app.post("/api/login", (req, res, next) => {
      passport.authenticate("local", (error: any, user: any, info: any) => {
        if (error) {
          return res.status(500).json({ message: "Internal server error" });
        }
        
        if (!user) {
          return res.status(401).json({ 
            message: info?.message || "Invalid username or password" 
          });
        }

        req.logIn(user, (err: any) => {
          if (err) {
            return res.status(500).json({ message: "Login failed" });
          }
          
          return res.json({ 
            success: true, 
            user: { 
              id: user.id, 
              username: user.username, 
              isAdmin: user.isAdmin 
            } 
          });
        });
      })(req, res, next);
    });

    // Logout route
    app.post("/api/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ success: true });
      });
    });

    console.log("Local authentication setup complete");
  } catch (error) {
    console.error("Error setting up auth:", error);
    throw error;
  }
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user as any;
  
  if (!user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};