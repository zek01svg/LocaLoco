import { createAuthClient } from "better-auth/client";

const baseURL = "http://localhost:3000";
const authClient = createAuthClient({
    baseURL: baseURL,
});

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token")!;
const resetPWBtn = document.getElementById("resetPW") as HTMLButtonElement;
resetPWBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const newPassword = (
        document.getElementById("newPassword") as HTMLInputElement
    ).value;

    if (!newPassword) {
        console.error("Password cannot be empty");
        return;
    }

    try {
        const { data, error } = await authClient.resetPassword({
            token: token,
            newPassword: newPassword,
        });

        if (error) {
            console.error("Failed to reset password:", error);
            return;
        }

        if (data) {
            console.log("Password reset successfully!");
            alert("Password reset successfully! Redirecting to login.");
            window.location.href = "http://localhost:3000/login.html";
        }
    } catch (err) {
        console.error(err);
    }
});
