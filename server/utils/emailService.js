import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (userEmail, userName, statusText = "approved", notes = "") => {
    try {
        const additionalText = notes ? `<p><strong>Reason:</strong> ${notes}</p>` : "";
        const response = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: userEmail,
            subject: `Reimbursement ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
            html: `
        <h2>Hello ${userName}</h2>
        <p>Your reimbursement was ${statusText.toLowerCase()}.</p>
        ${additionalText}
      `,
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};
