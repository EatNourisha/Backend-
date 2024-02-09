import nodemailer from 'nodemailer';
import fs from 'fs';
import config from "../../config";

const emailTemplate = fs.readFileSync(`./src/emails/promo.html`, 'utf-8');

function generateEmailContent(name: string): string {
    return emailTemplate.replace('{{ name }}', name);
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "support@eatnourisha.com",
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
        // user: "devcharles40@gmail.com",
        // pass: "jdritvarmedarrht"
    },
} as any);

export function sendDailyEmail(userEmail: string): void {
    const mailOptions = {
        from: {
            name: "Nourisha",
            address: "devcharles40@gmail.com",
        },
        to: userEmail,
        subject: 'Daily Email',
        html: generateEmailContent(userEmail.split('@')[0]),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending email to ${userEmail}:`, error.message);
        } else {
            console.log(`Email sent to ${userEmail}:`, info.response);
        }
    });
}
 