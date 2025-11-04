import { createAuthClient } from "better-auth/react";

// Backend API URL
const baseURL = 'http://localhost:3000';

// Frontend callback URL (where user returns after auth)
// Point to /login so the LoginPage useEffect can handle the redirect to /map
export const callbackURL = typeof window !== 'undefined'
    ? `${window.location.origin}/login`
    : 'http://localhost:5173/login';

export const authClient = createAuthClient({
    baseURL: baseURL
});