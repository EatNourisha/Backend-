import {  sendGiftRecipient, sendGiftSent } from "../services";
import { lineup, giftpurchase, customer, Customer, subscription, adminSettings, order } from "../models"; 
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
            // sub_end_date: {
            //     $lt: new Date()
            // }

            sub_end_date: {
                $lt: new Date(new Date().setMonth(new Date().getMonth() - 1))
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


//*********************************************************** */
// Welcome
// Welcome
// Welcome
//*********************************************************** */

// cron.schedule('* * * * *', async () => {
//     // console.log("######### Welcome emails Job runs every 1 min");
//     try {
//         const customers = await customer.find();

//     await Promise.all(customers.map(async (cus: any) => {
//         // const orderExists = await order.exists({ customer: cus?._id, status: "payment_received", delivery_date: { $lte: new Date() } });

//         const _cus = await customer.findById(cus?._id);

//         const orderExists = await order.exists({ customer: cus?._id, status: "payment_received" });
//         const lineupExists = await lineup.exists({ customer: cus?._id });
    
//         let returning = false;
    
//         if (orderExists || lineupExists) {
//             returning = true;
//         }

//         if (returning === false) {
//             if (_cus?.createdAt) {
//                 const createdAt = new Date(_cus.createdAt);
//                 const currentDate = new Date();
        
//                 const timeDifference = currentDate.getTime() - createdAt.getTime();
//                 const daysDifference = timeDifference / (1000 * 3600 * 24);

//                 const minutesDifference = timeDifference / (1000 * 60); 
        
//                 if (Math.floor(minutesDifference) === 300) {
//                     // Welcome email 2 runs here
//                 }
    
//                 if (Math.floor(daysDifference) === 2) {
//                     // Welcome email 3 runs here
//                 }

//                 if (Math.floor(daysDifference) === 4) {
//                     // Welcome email 4 runs here
//                 }
//                 if (Math.floor(daysDifference) === 9) {
//                     // Welcome email 5 runs here
//                 }
//                 if (Math.floor(daysDifference) === 14) {
//                     // Welcome email 6 runs here
//                 }
//                 if (Math.floor(daysDifference) === 19) {
//                     // Welcome email 7 runs here
//                 }
//                 if (Math.floor(daysDifference) === 24) {
//                     // Welcome email 8 runs here
//                     // console.log('Sending welcome email 6');
//                 }

//             }


//         }
                
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });

//*********************************************************** */
// Cart Abandonment
// Cart Abandonment
// Cart Abandonment
//*********************************************************** */

// let lastLogMessage: any = '';

// cron.schedule('* */1 * * *', async () => {
//     console.log("######### Cart emails Job runs every 1 min");
//     try {
//         const _orders = await order.find({ status: 'processing' }).sort({ createdAt: -1 });

//         await Promise.all(_orders.map(async (ord) => {
//             const _cus = await customer.findById(ord?.customer);
//             const _order = await order.findOne({ customer: _cus?._id }).sort({ createdAt: -1 });

//             if (_order?.status === 'processing' && _order?.createdAt) {
//                 const createdAt = new Date(_order.createdAt);
//                 const currentDate = new Date();

//                 const timeDifference = currentDate.getTime() - createdAt.getTime();
//                 const daysDifference = timeDifference / (1000 * 3600 * 24);
//                 const minutesDifference = timeDifference / (1000 * 60);

//                 if (Math.floor(minutesDifference) === 10) {
//                     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                     if (!lineupExists) {
//                         // const logMessage = await cartAbandonment1(_cus?.email, 'Cart 1' );
//                         const logMessage = 'Cart abandonment email 1 sent';
//                         if (lastLogMessage !== logMessage) {
//                             console.log(logMessage);
//                             lastLogMessage = logMessage;
//                         }
//                     }
//                 }

//                 if (Math.floor(daysDifference) === 3) {
//                     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                     if (!lineupExists) {
//                         const logMessage = 'Cart 2 body sent here';
//                         if (lastLogMessage !== logMessage) {
//                             console.log(logMessage);
//                             lastLogMessage = logMessage;
//                         }
                        
//                     }
//                 }


//                 // if (Math.floor(daysDifference) === 3) {
//                 //     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                 //     if (!lineupExists) {
//                 //         // const logMessage = 'Cart abandonment email 2 sent';
//                 //         // const logMessage = await cartAbandonment2( _cus?._id, {customer: _cus?._id } );
//                 //         const logMessage = await cartAbandonment2( {greeting: "hello", firstName: 'Zuby' } );
//                 //         if (lastLogMessage !== logMessage) {
//                 //             console.log(logMessage);
//                 //             lastLogMessage = logMessage;
//                 //         }
                        
//                 //     }
//                 // }

//                 if (Math.floor(daysDifference) === 7) {
//                     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                     if (!lineupExists) {
//                         const logMessage = 'Cart abandonment email 3 sent';
//                         if (lastLogMessage !== logMessage) {
//                             console.log(logMessage);
//                             lastLogMessage = logMessage;
//                         }
//                     }
//                 }

//                 if (Math.floor(daysDifference) === 11) {
//                     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                     if (!lineupExists) {
//                         const logMessage = 'Cart abandonment email 4 sent';
//                         if (lastLogMessage !== logMessage) {
//                             console.log(logMessage);
//                             lastLogMessage = logMessage;
//                         }
//                     }
//                 }

//                 if (Math.floor(daysDifference) === 15) {
//                     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                     if (!lineupExists) {
//                         const logMessage = 'Cart abandonment email 5 sent';
//                         if (lastLogMessage !== logMessage) {
//                             console.log(logMessage);
//                             lastLogMessage = logMessage;
//                         }
//                     }
//                 }

//                 if (Math.floor(daysDifference) === 19) {
//                     const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
//                     if (!lineupExists) {
//                         const logMessage = 'Cart abandonment email 6 sent';
//                         if (lastLogMessage !== logMessage) {
//                             console.log(logMessage);
//                             lastLogMessage = logMessage;
//                         }
//                     }
//                 }
//             }
//         }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });

cron.schedule('* */1 * * *', async () => {
    // console.log("######### Cart emails Job runs every 1 min");
    try {
        const _orders = await order.find({status: 'processing'}).sort({createdAt:-1});

    await Promise.all(_orders.map(async (ord: any) => {
        const _cus = await customer.findById(ord?.customer);
        const _order = await order.findOne({customer: _cus?._id}).sort({createdAt:-1});

        if(_order?.status === 'processing'){
        if (_order?.createdAt) {
            const createdAt = new Date(_order.createdAt);
            const currentDate = new Date();
    
            const timeDifference = currentDate.getTime() - createdAt.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            const minutesDifference = timeDifference / (1000 * 60); 
        
            if (Math.floor(minutesDifference) === 10) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
        
                let returning = false;
        
                if (lineupExists) {
                    returning = true;
                }
                if (!returning) {
                    // Send Cart Abandonment Email 1
                    // console.log('Cart abandonment email 1 sent');
                }
            }

            if (Math.floor(daysDifference) === 3) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
            
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    //  Cart Abdonment Email 2 runs here
                    // console.log('Cart abandonment email 2 sent');
                }

                }
            if (Math.floor(daysDifference) === 7) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    //  Cart Abdonment Email 3 runs here
                    // console.log('Cart abandonment email 3 sent');
                }
            }
            if (Math.floor(daysDifference) === 11) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    //  Cart Abdonment Email 4 runs here
                    // console.log('Cart abandonment email 4 sent');
                }

            }
            if (Math.floor(daysDifference) === 15) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    //  Cart Abdonment Email 5 runs here
                    // console.log('Cart abandonment email 5 sent');
                }

            }
            if (Math.floor(daysDifference) === 19) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    //  Cart Abdonment Email 6 runs here
                    // console.log('Cart abandonment email 6 sent');
                }

            }

        }


    }

                
    }));

    } catch (error) {
        console.error('Error updating settings:', error);
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

//*********************************************************** */
// Post subscription 
// Post subscription 
// Post subscription 
//*********************************************************** */

// cron.schedule('* */1 * * *', async () => {
//     // console.log("######### Post Subscription emails Job runs every 1 min");
//     try {
//         const _orders = await order.find({status: 'processing'}).sort({createdAt:-1});

//     await Promise.all(_orders.map(async (ord: any) => {
//         const _cus = await customer.findById(ord?.customer);
//         const _order = await order.findOne({customer: _cus?._id}).sort({createdAt:-1});

//         if(_order?.status === 'processing'){
//         if (_order?.createdAt) {
//             const createdAt = new Date(_order.createdAt);
//             const currentDate = new Date();
    
//             const timeDifference = currentDate.getTime() - createdAt.getTime();
//             const daysDifference = timeDifference / (1000 * 3600 * 24);
        

//             if (Math.floor(daysDifference) === 9) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
            
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Subscription Email 1 runs here
//                     // console.log('Post Subscription email 1 sent');
//                 }

//                 }
//             if (Math.floor(daysDifference) === 19) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 2 runs here
//                     // console.log('Post Subscription email 2 sent');
//                 }
//             }
//             if (Math.floor(daysDifference) === 29) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 3 runs here
//                     // console.log('Post Subscription email 3 sent');
//                 }

//             }
//             if (Math.floor(daysDifference) === 39) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 4 runs here
//                     // console.log('Post Subscription email 4 sent');
//                 }

//             }
//             if (Math.floor(daysDifference) === 49) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 5 runs here
//                     // console.log('Post Subscription email 5 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 59) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 6 runs here
//                     // console.log('Post Subscription email 6 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 69) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 7 runs here
//                     // console.log('Post Subscription email 7 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 79) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 8 runs here
//                     // console.log('Post Subscription email 8 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 89) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 8 runs here
//                     // console.log('Post Subscription email 9 sent');
//                 }

//             }

//         }


//     }

                
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });

//*********************************************************** */
// Re-engagement
// Re-engagement
// Re-engagement
//*********************************************************** */

// cron.schedule('* */1 * * *', async () => {
//     // console.log("######### Re-engagement emails Job runs every 1 min");
//     try {
//         const _orders = await order.find({status: 'processing'}).sort({createdAt:-1});

//     await Promise.all(_orders.map(async (ord: any) => {
//         const _cus = await customer.findById(ord?.customer);
//         const _order = await order.findOne({customer: _cus?._id}).sort({createdAt:-1});

//         if(_order?.status === 'processing'){
//         if (_order?.createdAt) {
//             const createdAt = new Date(_order.createdAt);
//             const currentDate = new Date();
    
//             const timeDifference = currentDate.getTime() - createdAt.getTime();
//             const daysDifference = timeDifference / (1000 * 3600 * 24);
        

//             if (Math.floor(daysDifference) === 13) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
            
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Re-engagement Email 1 runs here
//                     // console.log('Re-engagement email 1 sent');
//                 }

//                 }
//             if (Math.floor(daysDifference) === 27) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 2 runs here
//                     // console.log('Re-engagement email 2 sent');
//                 }
//             }
//             if (Math.floor(daysDifference) === 41) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 3 runs here
//                     // console.log('Re-engagement email 3 sent');
//                 }

//             }
//             if (Math.floor(daysDifference) === 55) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 4 runs here
//                     // console.log('Re-engagement email 4 sent');
//                 }

//             }
//             if (Math.floor(daysDifference) === 69) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 5 runs here
//                     // console.log('Re-engagement email 5 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 83) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Cart Abdonment Email 6 runs here
//                     // console.log('Re-engagement email 6 sent');
//                 }

//             }

//         }

//     }

                
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });


//*********************************************************** */
// customer retention
// customer retention
// customer retention
//*********************************************************** */

// cron.schedule('* * * * *', async () => {
//     // console.log("######### customer retention emails Job runs every 1 min");
//     try {
//         const customers = await customer.find();

//     await Promise.all(customers.map(async (cus: any) => {
//         const _cus = await customer.findById(cus?._id);

//             if (_cus?.createdAt) {
//                 const createdAt = new Date(_cus.createdAt);
//                 const currentDate = new Date();
        
//                 const monthsDifference = 
//                 (currentDate.getFullYear() - createdAt.getFullYear()) * 12 +
//                 (currentDate.getMonth() - createdAt.getMonth());
            
//             // Check for exact monthly anniversary
//             if (monthsDifference === 1 && currentDate.getDate() === createdAt.getDate()) {
//                 if (_cus?.level === 'Newbie') {
//                     // Customer retention email 1 runs here
//                     // console.log('Sending customer retention email 1');
//                 }
//             }
//             if (monthsDifference === 2 && currentDate.getDate() === createdAt.getDate()) {
//                 if (_cus?.level === 'Newbie') {
//                         // Customer retention email 2 runs here
//                         // console.log('Sending customer retention email 2');
//                     }
//                 } 
//                 if (monthsDifference === 3 && currentDate.getDate() === createdAt.getDate()) {
//                     if (_cus?.level === 'Newbie') {
//                         // Customer retention email 3 runs here 
//                         // console.log('Sending customer retention email 3');
//                     }
//                 }
//              }
            
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });

//*********************************************************** */
// Email Course
// Email Course
// Email Course
//*********************************************************** */

// cron.schedule('* * * * *', async () => {
//     // console.log("######### Email Course emails Job runs every 1 min");
//     try {
//         const customers = await customer.find();

//     await Promise.all(customers.map(async (cus: any) => {
//         const _cus = await customer.findById(cus?._id);

//             if (_cus?.createdAt) {
//                 const createdAt = new Date(_cus.createdAt);
//                 const currentDate = new Date();
        
//                 const monthsDifference = 
//                 (currentDate.getFullYear() - createdAt.getFullYear()) * 12 +
//                 (currentDate.getMonth() - createdAt.getMonth());
            
//             // Check for exact monthly anniversary
//             if (monthsDifference === 1 && currentDate.getDate() === createdAt.getDate()) {
//                     // Email Course email 1 runs here
//                     // console.log('Sending Email Course email 1');
//             }
//             if (monthsDifference === 2 && currentDate.getDate() === createdAt.getDate()) {
//                         // Email Course email 2 runs here
//                         // console.log('Sending Email Course email 2');
//                 } 
//                 if (monthsDifference === 3 && currentDate.getDate() === createdAt.getDate()) {
//                         // Email Course email 3 runs here 
//                         // console.log('Sending Email Course email 3');
//                 }
//                 if (monthsDifference === 4 && currentDate.getDate() === createdAt.getDate()) {
//                         // Email Course email 4 runs here 
//                         // console.log('Sending Email Course email 3');
//                 }
//              }
            
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });




export default cron
