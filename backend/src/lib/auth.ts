import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../database/db.js";
import { user, session, account, verification } from "../database/schema.js";
import sendEmail from "./mailer.js";

const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: { user, session, account, verification }
    }),
    baseURL: String(process.env.BETTER_AUTH_URL),
    secret: String(process.env.BETTER_AUTH_SECRET),
    user: {
        additionalFields: {
            hasBusiness: {
                type: "boolean",
                input: false,
                defaultValue: false
            },
            firstName: {
                type: "string",
                input: true
            },
            lastName: {
                type: "string",
                input: true
            },
            referralCode: {
                type: 'string',
                input: false,
                required: false
            },
            referredByUserID: {
                type: 'string',
                input: false,
                required: false
            },
            bio: {
                type: 'string',
                input: false
            }
        }
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }, _request) => {
            await sendEmail(
                user.email,
                'Reset your password',
                `Click the link to reset your password: ${url}`
            )
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, _request) => {
            await sendEmail(
                user.email,
                'Verify your email address',
                `Click the link to verify your email: ${url}`
            )
        },
        sendOnSignUp: true,
    },
    trustedOrigins: [
        "http://localhost:3000", // for testing
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


export default auth;
