import { sendGiftRecipient, sendGiftSent } from "../services";
import { lineup, giftpurchase, customer, Customer, subscription } from "../models"; // Adjust this path as needed
import cron from "node-cron";
import { createError } from "../utils";
import { NourishaBus } from "../libs";

cron.schedule('* */1 * * *', async () => {
    // console.log("#########777777 deactivate Job runs every 1 min");

    try {
        const _lineup = await lineup.find({
            status: 'active',
            sub_end_date: {
                $lt: new Date()
            }
        });

        await Promise.all(_lineup.map(async (line: any) => {
            await line.updateOne({ status: 'deactivated' });
            
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('* */1 * * *', async () => {
    // console.log("######### gift scheduled email runs every 1 min");
    try {
        const purGift = await giftpurchase.find({
            status: 'active',
            scheduled: true,
            scheduled_date: {
                $lt: new Date()
            }
        });

        await Promise.all(purGift.map(async (pur: any) => {
            let cus = await customer.findById(pur?.customer).lean<Customer>().exec();
            if (!cus) {
               throw createError("Customer does not exist", 404);
            }
            if(pur?.scheduled === true && pur?.scheduled_Email === false || null){
                  await sendGiftRecipient(pur?.reciever_email!, pur, false )
                  await sendGiftSent(cus?.email!, pur, false );
                  await pur.updateOne({ scheduled_Email: true });
              }
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('0 9 * * 5', async () => {
    console.log("#########777777 line up reminder runs every 1 min");

    try {
        const _subscription = await subscription.find({
            status: 'active',
            subscription_type: 'month'
        });

        await Promise.all(_subscription.map(async (sub: any) => {
            await NourishaBus.emit("lineup:reminder", { owner: sub?.customer });
            console.log('~~~~~~~~~~~~~#', 'line up reminderrrrrrrr')
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

export default cron
