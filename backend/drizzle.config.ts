import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv'

export default defineConfig({
    out: './src/drizzle',
    schema: './src/database/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
});