import { sendGiftRecipient, sendGiftSent } from "../services";
import { lineup, giftpurchase, customer, Customer, subscription } from "../models"; // Adjust this path as needed
import cron from "node-cron";
import { createError } from "../utils";
import { NourishaBus } from "../libs";
import {CustomerService} from "../services/customer.service"

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
            const sub = await subscription.findOne({customer: line.customer}).exec()
            if(sub){
                sub.status = 'inactive'
                await sub.save()
            }
            
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
                  await sendGiftRecipient(pur?.reciever_email!, pur)
                  await sendGiftSent(cus?.email!, pur);
                  await pur.updateOne({ scheduled_Email: true });
              }
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('0 12 * * 0', async () => {
    // console.log("#########777777 line up reminder runs every sunday 12 pm");

    try {
        const _subscription = await subscription.find({
            status: 'active',
            subscription_type: 'month'
        });

        await Promise.all(_subscription.map(async (sub: any) => {
            await NourishaBus.emit("lineup:reminder", { owner: sub?.customer });
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('* */1 * * *', async () => {
    // console.log("#########777777 deactivate Job runs every 1 min");

    try {
        const _lineup = await lineup.find({
            delivery_status: 'pending',
            delivery_date: {
                $lt: new Date()
            }
        });

        await Promise.all(_lineup.map(async (line: any) => {
            await line.updateOne({ delivery_status: 'delivered' });
            
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('* */1 * * *', async () => {
    // console.log("#########777777 deactivate Job runs every 1 min");

    try {
        const _lineup = await lineup.find({
            delivery_status: 'pending',
            delivery_date: {
                $lt: new Date()
            }
        });

        await Promise.all(_lineup.map(async (line: any) => {
            await line.updateOne({ delivery_status: 'delivered' });
            
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('0 0 * * 0', async () => {
    try {
        // console.log("#########777777 Job runs every week. sunday midnight");

        const inactiveCustomers = await CustomerService.findInactiveCustomers();
        console.log(`Found and saved ${inactiveCustomers.length} inactive customers.`);
    } catch (error) {
        console.error("Error running findInactiveCustomers job:", error);
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

cron.schedule('*/30 * * * *', async () => {    
    // console.log("#########777777 deactivate Job runs every 30 mins");

    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const _lineup = await lineup.find({
            status: 'deactivated',
            sub_end_date: {
                $gte: startOfMonth, // Start of the current month
                $lt: new Date()            
            }
        });

        await Promise.all(_lineup.map(async (line: any) => {
            const sub = await subscription.findOne({customer: line.customer}).exec()
            if(sub?.status === 'incomplete_expired' || sub?.status === 'cancelled' || sub?.status === 'canceled'){
                sub.status = 'inactive' 
                await sub.save()
            }
            
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});



export default cron
