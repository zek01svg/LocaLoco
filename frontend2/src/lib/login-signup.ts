import { createAuthClient } from "better-auth/client";

const baseURL = "http://localhost:3000";
const authClient = createAuthClient({
    baseURL: baseURL,
});

document.addEventListener("DOMContentLoaded", () => {
    const signupBtn = document.getElementById("signupBtn") as HTMLButtonElement;
    const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
    const googleBtn = document.getElementById("googleBtn") as HTMLButtonElement;

    signupBtn.addEventListener("click", async () => {
        const email = (
            document.getElementById("signupEmail") as HTMLInputElement
        ).value;
        const password = (
            document.getElementById("signupPassword") as HTMLInputElement
        ).value;
        const name = email.split("@")[0] as string;

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                name,
                password,
                callbackURL: baseURL,
            });

            if (error) {
                console.error("Signup failed:", error);
                return;
            }

            if (data) {
                window.location.href = baseURL;
            }
        } catch (err) {
            console.error(err);
        }
    });

    loginBtn.addEventListener("click", async () => {
        const email = (
            document.getElementById("loginEmail") as HTMLInputElement
        ).value;
        const password = (
            document.getElementById("loginPassword") as HTMLInputElement
        ).value;

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: baseURL,
            });
            const session = await authClient.getSession();
            console.log({ data, error });
            console.log(session);
        } catch (err) {
            console.error(err);
        }

        console.log("login button clicked");
    });

    googleBtn.addEventListener("click", async () => {
        try {
            const { data, error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: baseURL,
            });
            const session = await authClient.getSession();
            console.log({ data, error });
            console.log(session);
        } catch (err) {
            console.error(err);
        }
    });

    const resetPW = document.getElementById("resetPW") as HTMLButtonElement;
    const redirectTo = "http://localhost:3000/password-reset.html";

    resetPW.addEventListener("click", async () => {
        const email = (
            document.getElementById("resetPwEmail") as HTMLInputElement
        ).value;

        if (!email) {
            console.error("Email is required");
            return;
        }

        try {
            const { data, error } = await authClient.requestPasswordReset({
                email: email,
                redirectTo: redirectTo,
            });

            if (error) {
                console.error("Reset request failed:", error);
                return;
            }

            if (data) {
                console.log("Password reset link sent");
            }
        } catch (err) {
            console.error(err);
        }
    });
});
