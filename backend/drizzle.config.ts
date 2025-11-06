import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    out: './src/drizzle',
    schema: './src/database/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: "mysql://root:@127.0.0.1:3308/wad2_project"
    },
    verbose:true,
    strict:true
});