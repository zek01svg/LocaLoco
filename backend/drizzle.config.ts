import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv'

export default defineConfig({
    out: './src/db',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
});