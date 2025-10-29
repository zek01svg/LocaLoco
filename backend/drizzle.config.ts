import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/drizzle',
    schema: './src/database/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: String(process.env.DB_URL),
    },
    verbose:true,
    strict:true
});