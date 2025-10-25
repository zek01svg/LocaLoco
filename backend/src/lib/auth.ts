import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../database/db.js";
import { user, session, account, verification } from "../database/schema.js";
import dotenv from 'dotenv'

const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql", 
        schema: { user, session, account, verification }
    }),
    emailAndPassword: { 
        enabled: true, 
        autoSignIn: true
    }, 
    trustedOrigins: [
        "http://localhost:3000", // backend
        "http://localhost:5173"  // frontend
    ],
    socialProviders: { 
        google: { 
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }
    }
});

export default auth