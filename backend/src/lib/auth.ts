import { betterAuth, boolean } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../database/db.js";
import { user, session, account, verification } from "../database/schema.js";
import dotenv from 'dotenv'

const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql", 
        schema: { user, session, account, verification }
    }),
    user: {
        additionalFields: {
            hasBusiness: {
                type: "boolean",
                input: false
            },
            referralCode: {
                type: 'string',
                input: false
            },
            referredByUserID: {
                type:'string',
                input:false
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
            prompt: 'select_account',
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            getUserInfo: async (token) => {
                // Custom implementation to get user info
                const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                },
                });
                const profile = await response.json();
                return {
                    user: {
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        emailVerified: profile.verified_email,
                    },
                    data: profile,
                };
            }
        }
    }
})

export default auth