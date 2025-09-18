import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePath(p: string) {
  return path.resolve(__dirname, p).replace(/\\/g, "/");
}

export default defineConfig(async () => {
  const cartographerPlugin =
    process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? (await import("@replit/vite-plugin-cartographer")).cartographer()
      : null;

  return {
    root: resolvePath("client"), // 👈 set frontend root to client/
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(cartographerPlugin ? [cartographerPlugin] : []),
    ],
    resolve: {
      alias: {
        "@": resolvePath("client/src"),
        "@shared": resolvePath("shared"),
        "@assets": resolvePath("attached_assets"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    build: {
      outDir: resolvePath("dist/public"), // 👈 frontend assets go here
      emptyOutDir: true,
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === "UNRESOLVED_IMPORT" &&
            warning.source?.startsWith("@/")
          ) {
            throw new Error(`Unresolved alias: ${warning.source}`);
          }
          warn(warning);
        },
      },
    },
    server: {
      host: "0.0.0.0",
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
