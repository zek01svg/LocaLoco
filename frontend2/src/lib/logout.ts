// src/lib/logout.ts
import { createAuthClient } from "better-auth/client";

const baseURL = "http://localhost:3000";
const authClient = createAuthClient({
    baseURL: baseURL,
});

document.addEventListener("DOMContentLoaded", () => {
    const signoutBtn = document.getElementById("signoutBtn");

    if (signoutBtn) {
        signoutBtn.addEventListener("click", async () => {
            try {
                const signout = await authClient.signOut();
                console.log(signout);
            } catch (err) {
                console.error(err);
            }
        });
    }
});
