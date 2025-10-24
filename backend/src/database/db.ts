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

// import { businesses } from './schema.js'
// async function getrows () {
//     const businessRows = await db.select().from(businesses)
//     console.log('businesses:', businessRows)
// }
// getrows()

// console.log(process.env.DB_HOST)
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)
// console.log(process.env.DB_NAME)
// console.log(process.env.DB_PORT)
// console.log(process.env.DATABASE_URL)

export default db