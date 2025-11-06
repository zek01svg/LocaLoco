import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'

const sslConfig = process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: true }
  : { rejectUnauthorized: false }

const db = drizzle(mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "wad2_project",
    port: 3308,
    ssl: sslConfig
}));

// test for the connection
(async () => {
    try {
        const result = await db.execute(`SELECT 1 + 1 AS test`);
        console.log('✅ Database connection successful! Test result:', result[0]);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
})();

export default db