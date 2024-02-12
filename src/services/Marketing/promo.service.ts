import nodemailer from 'nodemailer';
import fs from 'fs';
import config from "../../config";

let path = ""

if(__dirname === "app") {
 path = "./dist/src/emails/referal.html"
} else{
 path ="./src/emails/referal.html"
}

const emailTemplate = fs.readFileSync(path, 'utf-8');

function generateEmailContent(firstname: string,): string {
    return emailTemplate.replace('{{ firstname }}', firstname)
                       
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "support@eatnourisha.com",
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
    },
} as any);

export function sendDailyEmail(userEmail: string, firstname: string, ): void {
    const mailOptions = {
        from: {
            name: "Nourisha",
            address: "support@eatnourisha.com",
        },
        to: userEmail,
        subject: 'Share the Nourisha love! Get £10 off your next order',
        html: generateEmailContent(firstname),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending email to ${userEmail}:`, error.message);
        } else {
            console.log(`Email sent to ${userEmail}:`, info.response);
        }
    });
}
 