// server/db.ts
import 'dotenv/config';
import * as schema from '@shared/schema';

// ---- choose driver based on env/url ----
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');

const isNeon =
  process.env.DB_PROVIDER === 'neon' ||
  /neon\.tech|neondb\.net/.test(url);

// Neon (serverless/HTTP or WS)
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Node Postgres (local Docker)
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool as PgPool } from 'pg';

export type DB =
  | ReturnType<typeof drizzlePg>
  | ReturnType<typeof drizzleNeon>;

let db: DB;

if (isNeon) {
  // Use WebSocket in Node (Neon’s fetch driver needs this)
  neonConfig.webSocketConstructor = ws;
  const client = neon(url);
  db = drizzleNeon({ client, schema });
} else {
  const pool = new PgPool({ connectionString: url });
  db = drizzlePg(pool, { schema });
}

export { db };
