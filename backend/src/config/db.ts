
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

export const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
                host: process.env.DB_HOST,
                port,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            }
);