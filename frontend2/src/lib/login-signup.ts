import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
    baseURL: "http://localhost:5173"
});

// get the buttons 
const signupBtn = document.getElementById("signupBtn") as HTMLButtonElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const googleBtn = document.getElementById('googleBtn') as HTMLButtonElement

signupBtn.addEventListener("click", async () => {
    const email = (document.getElementById("signupEmail") as HTMLInputElement).value;
    const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
    const name = email.split("@")[0]

    try {
        const { data, error } = await authClient.signUp.email({ 
            email, name, password,
            callbackURL: "http://localhost:5173"
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
            callbackURL: "http://localhost:5173"
        });
        console.log({ data, error });
    } catch (err) {
        console.error(err);
    }
});

googleBtn.addEventListener("click", async () => {
    try {
        const { data, error } = await authClient.signIn.social({ 
            provider: "google",
            callbackURL: "http://localhost:5173"
        });
        console.log({ data, error });
    } 
    catch (err) {
        console.error(err);
    }
});