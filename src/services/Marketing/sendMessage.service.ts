import { customer } from '../../models/index';
import nodemailer from 'nodemailer';
import config from "../../config";
import fs from 'fs';

let path = ""

if(__dirname === "app") {
    path = "./dist/src/emails/promo.html"
} else{
    path =`./src/emails/promo.html`
}

const emailTemplate = fs.readFileSync(path, 'utf-8');


function generateEmailContent( firstName: string, message :string): string {
    return emailTemplate.replace(/{{firstName}}/g, firstName)
                        .replace(/{{message}}/g, message);                      
}


async function sendMessageToUsers  ( subscriptionStatus: string, subject : string, message: string ) {
    const customers = await customer.find({});

    switch (true) {
        case (subscriptionStatus === "active"):
            const targetUser = customers.filter(user => user.subscription_status === "active");
    
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "support@eatnourisha.com",
                    clientId: config.GOOGLE_CLIENT_ID,
                    clientSecret: config.GOOGLE_CLIENT_SECRET,
                    refreshToken: config.GOOGLE_REFRESH_TOKEN,
                },
            });
            
            for (const user of targetUser) {
                const mailOptions = {
                    from: "support@eatnourisha.com",
                    to: user.email, 
                    subject: subject,
                    html: generateEmailContent(user.first_name, message),
                };
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log("Message sent: %s", info.messageId);
                } catch (error) {
                    console.error("Error sending message:", error);
        
              }
               
            } 
            
            break;
    
        
        case (subscriptionStatus === "cancelled"):
           
            const targetUser2 = customers.filter(user => user.subscription_status === "cancelled");
    
            const transporter2 = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "support@eatnourisha.com",
                    clientId: config.GOOGLE_CLIENT_ID,
                    clientSecret: config.GOOGLE_CLIENT_SECRET,
                    refreshToken: config.GOOGLE_REFRESH_TOKEN,
                },
            });
            
            for (const user of targetUser2) {
                const mailOptions = {
                    from: "support@eatnourisha.com",
                    to: user.email, 
                    subject: subject,
                    html: generateEmailContent(user.first_name, message),
                };
                try {
                    const info = await transporter2.sendMail(mailOptions);
                    console.log("Message sent: %s", info.messageId);
                } catch (error) {
                    console.error("Error sending message:", error);
        
              }
               
            } 
            break;
    
        case (subscriptionStatus === "incomplete_expired"):
            
            const targetUser3 = customers.filter(user => user.subscription_status === "incomplete_expired");

            const transporter3 = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "support@eatnourisha.com",
                    clientId: config.GOOGLE_CLIENT_ID,
                    clientSecret: config.GOOGLE_CLIENT_SECRET,
                    refreshToken: config.GOOGLE_REFRESH_TOKEN,
                },
            });
            
            for (const user of targetUser3) {
                const mailOptions = {
                    from: "support@eatnourisha.com",
                    to: user.email, 
                    subject: subject,
                    html: generateEmailContent(user.first_name, message),
                };
                try {
                    const info = await transporter3.sendMail(mailOptions);
                    console.log("Message sent: %s", info.messageId);
                } catch (error) {
                    console.error("Error sending message:", error);
        
              }
               
            }
            break;

            case (subscriptionStatus === "expired"):
               
                const targetUser4 = customers.filter(user => user.subscription_status === "incomplete_expired");

                const transporter4 = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: "support@eatnourisha.com",
                        clientId: config.GOOGLE_CLIENT_ID,
                        clientSecret: config.GOOGLE_CLIENT_SECRET,
                        refreshToken: config.GOOGLE_REFRESH_TOKEN,
                    },
                });
                
                for (const user of targetUser4) {
                    const mailOptions = {
                        from: "support@eatnourisha.com",
                        to: user.email, 
                        subject: subject,
                        html: generateEmailContent(user.first_name, message),
                    };
                    try {
                        const info = await transporter4.sendMail(mailOptions);
                        console.log("Message sent: %s", info.messageId);
                    } catch (error) {
                        console.error("Error sending message:", error);
            
                  }
                   
                }
                break;

                case (subscriptionStatus === null):
            
                const targetUser5 = customers.filter(user => user.subscription_status === null || user.subscription_status === undefined);

                const transporter5 = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: "support@eatnourisha.com",
                        clientId: config.GOOGLE_CLIENT_ID,
                        clientSecret: config.GOOGLE_CLIENT_SECRET,
                        refreshToken: config.GOOGLE_REFRESH_TOKEN,
                    },
                });
                
                for (const user of targetUser5) {
                    const mailOptions = {
                        from: "support@eatnourisha.com",
                        to: user.email,
                        subject: subject,
                        html: generateEmailContent(user.first_name, message),
                    };
                    try {
                        const info = await transporter5.sendMail(mailOptions);
                        console.log("Message sent: %s", info.messageId);
                    } catch (error) {
                        console.error("Error sending message:", error);
            
                  }
                   
                }
                break;
            
    
        default:
        
    }
    
       
      
}


export default sendMessageToUsers;