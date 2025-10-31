// backend/lib/auth.ts (or wherever your auth.ts is)
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../database/db.js";
import { user, session, account, verification } from "../database/schema.js";
import dotenv from 'dotenv';

const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql", 
        schema: { user, session, account, verification }
    }),
    user: {
        additionalFields: {
            role: { // ✅ Add role field
                type: "string",
                input: true, // Allow input during signup
                defaultValue: "user"
            },
            hasBusiness: {
                type: "boolean",
                input: false
            },
            firstName: { // ✅ Add firstName
                type: "string",
                input: true
            },
            lastName: { // ✅ Add lastName
                type: "string",
                input: true
            },
            referralCode: {
                type: 'string',
                input: false
            },
            referredByUserID: {
                type: 'string',
                input: false
            }
        }
    },
    emailAndPassword: { 
        enabled: true, 
        autoSignIn: true
    }, 
    trustedOrigins: [
        "http://localhost:3000", // for testing
        "http://localhost:5173", // for dev
        "https://localoco.azurewebsites.net" // for staging and prod 
    ],
    socialProviders: { 
        google: { 
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }
    }
});

export default auth;
