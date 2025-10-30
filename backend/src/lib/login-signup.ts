import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
    baseURL: String(process.env.BETTER_AUTH_URL)
});

document.addEventListener('DOMContentLoaded', (()=>{
    // get the buttons 
    const signupBtn = document.getElementById("signupBtn") as HTMLButtonElement;
    const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
    const googleBtn = document.getElementById('googleBtn') as HTMLButtonElement

    signupBtn.addEventListener("click", async () => {
        const email = (document.getElementById("signupEmail") as HTMLInputElement).value;
        const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
        const name = email.split("@")[0] as string

        try {
            const { data, error } = await authClient.signUp.email({ 
                email, name, password,
                callbackURL: String(process.env.BETTER_AUTH_URL)
            });
            console.log({ data, error });
        } catch (err) {
            console.error(err);
        }
    });

    loginBtn.addEventListener("click", async () => {

        const email = (document.getElementById("loginEmail") as HTMLInputElement).value;
        const password = (document.getElementById("loginPassword") as HTMLInputElement).value;

        try {
            const { data, error } = await authClient.signIn.email({ 
                email, password,
                callbackURL: String(process.env.BETTER_AUTH_URL)
            });
            console.log({ data, error });
        } catch (err) {
            console.error(err);
        }

        console.log('login button clicked')
    });

    googleBtn.addEventListener("click", async () => {
        try {
            const { data, error } = await authClient.signIn.social({ 
                provider: "google",
                callbackURL: String(process.env.BETTER_AUTH_URL)
            });
            console.log({ data, error });
        } 
        catch (err) {
            console.error(err);
        }
    });
}))