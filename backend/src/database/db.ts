import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import 'dotenv/config'

const db = drizzle(mysql.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT)!
}))


export default db