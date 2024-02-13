import cron from 'node-cron';
import SubscriptionModel, { Subscription } from '../../models/subscription';
import { Customer } from '../../models/index';
import nodemailer from 'nodemailer';
import fs from 'fs';
import config from "../../config";


let path = require("path");

let promoFile = path?.resolve(__dirname, "../../emails/subreminder.html");

if(process.env.ENVIRONMENT !== "development") {
    promoFile = `/usr/app/dist/src/emails/subreminder.html`
}

const emailTemplate = fs.readFileSync(promoFile, 'utf-8');


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


async function checkNextBillingDateAndSendReminder(): Promise<void> {
    try {

        const subscriptions: Subscription[] = await SubscriptionModel.find({}).populate('customer');;


        for (const subscription of subscriptions) {
            if (!subscription.customer) continue;
            const customer: Customer = subscription.customer as Customer;
            const customerEmail: string = customer.email;
            const timeDiff = new Date(subscription.next_billing_date).getTime() - new Date().getTime();

            const daysUntilNextBilling = timeDiff / (1000 * 60 * 60 * 24);


            if (daysUntilNextBilling === 2) {
                const mailOptions = {
                    from: {
                        name: "Nourisha",
                        address: "support@eatnourisha.com",
                    },
                    to: customerEmail,
                    subject: 'Don\t miss out! Your Nourisha subscription is about to expire',
                    html: generateEmailContent(customer.first_name),
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Error sending email to ${customerEmail}:`, error.message);
                    } else {
                        console.log(`Email sent to ${customerEmail}:`, info.response);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error checking next billing date and sending reminder:', error);
    }
}

export default function startSubscriptionCronJob(): void {
    cron.schedule('0 0 * * *', async () => {
        await checkNextBillingDateAndSendReminder();
        console.log('Next billing date check and reminder sent successfully');
    });

}
