import { EmailClient } from '@azure/communication-email';

const connectionString = String(process.env.COMMUNICATION_SERVICES_CONNECTION_STRING)
const senderAddress = String(process.env.SENDER_ADDRESS)
const emailClient = new EmailClient(connectionString!);

/**
 * Sends an email using Azure Communication Services.
 * @param to - The recipient's email address.
 * @param subject - The subject line of the email.
 * @param htmlContent - The HTML body of the email.
 */
async function sendEmail(to: string, subject: string, htmlContent: string) {
    if (!emailClient) {
        console.error("Email client is not initialized. Check your connection string.");
        return;
    }

    const message = {
        senderAddress: senderAddress!,
        content: {
            subject: subject,
            html: htmlContent,
        },
        recipients: {
            to: [{ address: to }],
        }
    };

    try {
        console.log(`Sending email to ${to} with subject: ${subject}`);
        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();
        console.log(`Email sent successfully. Message ID: ${result.id}`);
    } 
    catch (error:any) {
        console.error(`Error sending email: ${error}`);
    }
}

export default sendEmail