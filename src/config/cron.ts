import {  sendGiftRecipient, sendGiftSent } from "../services";
import { lineup, giftpurchase, customer, Customer, subscription, adminSettings, order, } from "../models"; 
import cron from "node-cron";
import { createError } from "../utils";
import { NourishaBus } from "../libs";
import {CustomerService} from "../services/customer.service"
// import moment from 'moment';
import { addDays } from 'date-fns';



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
            await line.updateOne({ status: 'inactive' });
            const sub = await subscription.findOne({customer: line.customer}).exec()
            const cus = await customer.findOne({_id: line.customer}).exec()
            if(sub){
                sub.status = 'inactive'
                await sub.save()
            }
            if(cus){
                cus.activeLineup = false
                await cus.save()
            }
            
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
            status: 'inactive',
            sub_end_date: {
                $lt: new Date(new Date().setMonth(new Date().getMonth() - 2))
            }
        });

        await Promise.all(_lineup.map(async (line: any) => {
            await line.updateOne({ status: 'deactivated' });
            // const sub = await subscription.findOne({customer: line.customer}).exec()
            // if(sub){
            //     sub.status = 'inactive'
            //     await sub.save()
            // }
            
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
            if (sub) {
                if (sub.status !== 'active') {
                    sub.status = 'inactive';
                    await sub.save();
                }
            }            
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

// cron.schedule('0 * * * *', async () => { 
    
//     try {
//         // console.log("#########777777 Job runs evert 1 houre);

//         const dublicates = await MealService.duplicateAndEditMealPacks();
//         console.log('dublicated meals', dublicates)
//     } catch (error) {
//         console.error("Error running findInactiveCustomers job:", error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });


cron.schedule('* */1 * * *', async () => {
    // console.log("######### Asian delivery Job runs every 1 min");
    try {
        const setting = await adminSettings.findOne();
        if (setting) {
            const currentDate = new Date();
            let wedSatDate = setting.wed_sat;

            if (wedSatDate! <= currentDate) {
                setting.wed_sat = addDays(wedSatDate!, 7);;
                let nextUpperTuesday = addDays(wedSatDate!, 14); 
                setting.sun_tue = nextUpperTuesday;
            }

            await setting.save();
        }
    } catch (error) {
        console.error('Error updating settings:', error);
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

//*********************************************************** */
// Email Marketing Blueprint Automation
// Email Marketing Blueprint Automation
// Email Marketing Blueprint Automation
//*********************************************************** */

// cron.schedule('*/5 * * * *', async () => {
//     console.log("######### BluePrint emails Job runs every 5 min WELCOM");
//     try {
//         await AllWelcomeEmails()

//     } catch (error) {
//         console.error('Error updating settings - AllWelcomeEmails:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });


// cron.schedule('*/10 * * * *', async () => {
//     console.log("######### BluePrint emails Job runs every 10 min - CART");
//     try {
//         await AllCartEmails()
//     } catch (error) {
//         console.error('Error updating settings - AllCartEmails:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });


// cron.schedule('0 0 */1 * *', async () => {
//     console.log("######### BluePrint emails Job runs every 24 hours- RENGAGEMENT");
//     try {
//         await AllReEngagementEmails()

//     } catch (error) {
//         console.error('Error updating settings - AllReEngagementEmails :', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });

// cron.schedule('0 0 */2 * *', async () => {
//     console.log("######### BluePrint emails Job runs every 48 hours - RETENTION");
//     try {
//         await AllCustomerRetentionEmails()

//     } catch (error) {
//         console.error('Error updating settings - AllCustomerRetentionEmails:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });


cron.schedule('* */1 * * *', async () => {
    // console.log("#########777777 New User Job runs every 1 min");

    try {
        const cus = await customer.find({newUser: true}).exec();

        await Promise.all(cus.map(async (c: any) => {
        const orderExists = await order.exists({ customer: c._id, status: "payment_received"});
        const lineupExists = await lineup.exists({ customer: c._id });

            let returning = true;

            if (orderExists || lineupExists) {
            returning = false;
            }

            c.newUser = returning
           await c.save()


        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});


export default cron
