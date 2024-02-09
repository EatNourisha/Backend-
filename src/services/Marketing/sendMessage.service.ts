import { customer } from '../../models/index';
import nodemailer from 'nodemailer';
import config from "../../config";


async function sendMessageToUsers  ( subscriptionStatus: string, subject : string, message: string ) {
    const customers = await customer.find({});

    
    if(subscriptionStatus === "active") {
        const targetUser = customers.filter(user => user.subscription_status === "active")

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
       
      for (const user of targetUser) {
        const mailOptions = {
            from: "devcharles40@gmail.com",
            to: user.email, 
            subject: subject,
            text: message,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
        } catch (error) {
            console.error("Error sending message:", error);

      }
       
    } 
}
}

export default sendMessageToUsers;