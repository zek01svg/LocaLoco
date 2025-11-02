import { createAuthClient } from "better-auth/client";

const baseURL = 'http://localhost:3000'
const authClient = createAuthClient({
    baseURL: baseURL
});

document.addEventListener('DOMContentLoaded', (()=>{
    // get the button
    const signoutBtn = document.getElementById('signoutBtn') as HTMLButtonElement

    signoutBtn.addEventListener("click", async () => {
        try {
            const signout = await authClient.signOut()
            console.log(signout)
        } 
        catch (err) {
            console.error(err);
        }
    });
}))