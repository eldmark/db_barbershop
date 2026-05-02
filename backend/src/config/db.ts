
import { Pool } from "pg";

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;

if (!process.env.DATABASE_URL) {
    const missing = [];
    if (!process.env.DB_HOST) missing.push("DB_HOST");
    if (!process.env.DB_USER) missing.push("DB_USER");
    if (!process.env.DB_NAME) missing.push("DB_NAME");
    if (missing.length) {
        console.warn(`DB config: missing env vars: ${missing.join(", ")}. Health checks will fail until configured.`);
    }
}

// Coerce env values to strings to avoid driver errors when values come from non-string sources
const connectionString = process.env.DATABASE_URL ? String(process.env.DATABASE_URL) : undefined;
const host = process.env.DB_HOST ? String(process.env.DB_HOST) : undefined;
const user = process.env.DB_USER ? String(process.env.DB_USER) : undefined;
const password = process.env.DB_PASSWORD !== undefined ? String(process.env.DB_PASSWORD) : undefined;
const database = process.env.DB_NAME ? String(process.env.DB_NAME) : undefined;

export const pool = new Pool(
    connectionString
        ? { connectionString }
        : {
                host,
                port,
                user,
                password,
                database,
            }
);

// Helpful runtime check when connection problems occur
if (!connectionString && (!host || !user || !database)) {
    console.warn(`DB pool created with missing configuration: host=${host}, user=${user}, database=${database}`);
}