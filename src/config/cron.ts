import {  sendGiftRecipient, sendGiftSent } from "../services";
import { lineup, foodbox, giftpurchase, customer, Customer, subscription, order, mealPack, } from "../models"; 
import cron from "node-cron";
import { createError } from "../utils";
import { NourishaBus } from "../libs";
import {CustomerService} from "../services/customer.service"
// import moment from 'moment';
// import { addDays } from 'date-fns';



cron.schedule('* */1 * * *', async () => {
  // console.log("#########777777 deactivate Job runs every 1 min");

  try {
      const _lineup = await foodbox.find({ 
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
        const _lineup = await foodbox.find({
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

cron.schedule('0 12 * * 0', async () => {
    // console.log("#########777777 line up reminder runs every sunday 12 pm");

    try {
        const _subscription = await subscription.find({
            status: 'active',
            subscription_type: 'month'
        });

        await Promise.all(_subscription.map(async (sub: any) => {
            await NourishaBus.emit("foodbox:reminder", { owner: sub?.customer });
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
            // await line.updateOne({ delivery_status: 'delivered' });
            await line.updateOne({ $set: { delivery_status: 'delivered', status: 'inactive' } });

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
        const _lineup = await foodbox.find({
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
    try {
        const subs = await subscription.find({status: 'active', end_date: {$lt: new Date()}}).exec();

        await Promise.all(subs.map(async (sub: any) => {
         sub.status = 'inactive'
         await sub.save()

        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

// cron.schedule('* */1 * * *', async () => {
//     // console.log("######### Asian delivery Job runs every 1 min");
//     try {
//         const setting = await adminSettings.findOne();
//         if (setting) {
//             const currentDate = new Date();
//             let wedSatDate = setting.wed_sat;

//             if (wedSatDate! <= currentDate) {
//                 setting.wed_sat = addDays(wedSatDate!, 7);;
//                 let nextUpperTuesday = addDays(wedSatDate!, 14); 
//                 setting.sun_tue = nextUpperTuesday;
//             }

//             await setting.save();
//         }
//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Europe/London"
// });


type CartEmails = {
  cart0: boolean;
  cart1: boolean;
  cart2: boolean;
  cart3: boolean;
  cart4: boolean;
  cart5: boolean;
  cart6: boolean;
  cart7: boolean;
  cart8: boolean;
  cart9: boolean;
  cart10: boolean;
  cart11: boolean;
};

type PostEmails = {
  postsub0: boolean;
  postsub1: boolean;
  postsub2: boolean;
  postsub3: boolean;
  postsub4: boolean;
  postsub5: boolean;
  postsub6: boolean;
  postsub7: boolean;
  postsub8: boolean;
  postsub9: boolean;
  postsub10: boolean;
  postsub11: boolean;
  postsub12: boolean;
  postsub13: boolean;
};

type ReengageEmails = {
  reengage1: boolean;
  reengage2: boolean;
  reengage3: boolean;
  reengage4: boolean;
  reengage5: boolean;
  reengage6: boolean;
};

const initializeEmails = <T extends Record<string, boolean>>(keys: T): T => {
  const initialized: Record<string, boolean> = {};
  Object.keys(keys).forEach((key) => {
    initialized[key] = false;
  });
  return initialized as T;
};

cron.schedule(
  "* */1 * * *", 
  async () => {
    // console.log("Order Job...");

    try {
        const orders = await order.find({}).sort({ createdAt: -1 });

      await Promise.all(
        orders.map(async (orde: any) => {
          try {
            const lastOrder = await order
              .find({ customer: orde.customer })
              .sort({ createdAt: -1 })
              .limit(1);

            if (
              lastOrder.length > 0 &&
              lastOrder[0].status === "payment_received"
            ) {
              const customerData = await customer.findById(orde.customer);

              if (customerData && customerData.emailUpdated === undefined) {
                customerData.emailUpdated = false; 
                await customerData.save();
              }
              
              if (customerData && customerData?.emailUpdated === false) {
                customerData.POSTSUBEEMAILS = initializeEmails<PostEmails>({
                  postsub0: false,
                  postsub1: false,
                  postsub2: false,
                  postsub3: false,
                  postsub4: false,
                  postsub5: false,
                  postsub6: false,
                  postsub7: false,
                  postsub8: false,
                  postsub9: false,
                  postsub10: false,
                  postsub11: false,
                  postsub12: false,
                  postsub13: false,
                });

                customerData.CARTEMAILS = initializeEmails<CartEmails>({
                  cart0: customerData.CARTEMAILS.cart0,
                  cart1: false,
                  cart2: false,
                  cart3: false,
                  cart4: false,
                  cart5: false,
                  cart6: false,
                  cart7: false,
                  cart8: false,
                  cart9: false,
                  cart10: false,
                  cart11: false,
                });

                customerData.REENGAGEEMAILS = initializeEmails<ReengageEmails>({
                  reengage1: false,
                  reengage2: false,
                  reengage3: false,
                  reengage4: false,
                  reengage5: false,
                  reengage6: false,
                });

                customerData.emailUpdated = true; 
                await customerData.save();
              }
            }
          } catch (err) {
            // console.error(`Error processing order ID ${orde._id}:`, err.message);
          }
        })
      );
    } catch (error) {
      console.error("Error in New User Job:", error.message);
    }
  },
  {
    scheduled: true,
    timezone: "Europe/London",
  }
);


cron.schedule(
    "* */1 * * *", 
    async () => {
      // console.log("Lineup Job...");
  
      try {
          const lineups = await foodbox.find({}).sort({ createdAt: -1 });
  
        await Promise.all(
          lineups.map(async (line: any) => {
            try {
              const lastLineup = await foodbox
                .find({ customer: line.customer })
                .sort({ createdAt: -1 })
                .limit(1);
  
              if (
                lastLineup.length > 0 &&
                lastLineup[0].status === "active"
              ) {
                const customerData = await customer.findById(line.customer);
  
                if (customerData && customerData.emailUpdated === undefined) {
                  customerData.emailUpdated = false; 
                  await customerData.save();
                }
                
                if (customerData && customerData?.emailUpdated === false) {
                  customerData.POSTSUBEEMAILS = initializeEmails<PostEmails>({
                    postsub0: false,
                    postsub1: false,
                    postsub2: false,
                    postsub3: false,
                    postsub4: false,
                    postsub5: false,
                    postsub6: false,
                    postsub7: false,
                    postsub8: false,
                    postsub9: false,
                    postsub10: false,
                    postsub11: false,
                    postsub12: false,
                    postsub13: false,
                  });
  
                  customerData.CARTEMAILS = initializeEmails<CartEmails>({
                    cart0: customerData.CARTEMAILS.cart0,
                    cart1: false,
                    cart2: false,
                    cart3: false,
                    cart4: false,
                    cart5: false,
                    cart6: false,
                    cart7: false,
                    cart8: false,
                    cart9: false,
                    cart10: false,
                    cart11: false,
                  });
  
                  customerData.REENGAGEEMAILS = initializeEmails<ReengageEmails>({
                    reengage1: false,
                    reengage2: false,
                    reengage3: false,
                    reengage4: false,
                    reengage5: false,
                    reengage6: false,
                  });
  
                  customerData.emailUpdated = true; 
                  await customerData.save();
                }
              }
            } catch (err) {
              // console.error(`Error processing order ID ${line._id}:`, err.message);
            }
          })
        );
      } catch (error) {
        console.error("Error in New User Job:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: "Europe/London",
    }
  );

cron.schedule(
    "* */1 * * *", 
    async () => {
      // console.log("Lineup Job...");
  
      try {
          const lineups = await lineup.find({}).sort({ createdAt: -1 });
  
        await Promise.all(
          lineups.map(async (line: any) => {
            try {
              const lastLineup = await lineup
                .find({ customer: line.customer })
                .sort({ createdAt: -1 })
                .limit(1);
  
              if (
                lastLineup.length > 0 &&
                lastLineup[0].status === "active"
              ) {
                const customerData = await customer.findById(line.customer);
  
                if (customerData && customerData.emailUpdated === undefined) {
                  customerData.emailUpdated = false; 
                  await customerData.save();
                }
                
                if (customerData && customerData?.emailUpdated === false) {
                  customerData.POSTSUBEEMAILS = initializeEmails<PostEmails>({
                    postsub0: false,
                    postsub1: false,
                    postsub2: false,
                    postsub3: false,
                    postsub4: false,
                    postsub5: false,
                    postsub6: false,
                    postsub7: false,
                    postsub8: false,
                    postsub9: false,
                    postsub10: false,
                    postsub11: false,
                    postsub12: false,
                    postsub13: false,
                  });
  
                  customerData.CARTEMAILS = initializeEmails<CartEmails>({
                    cart0: customerData.CARTEMAILS.cart0,
                    cart1: false,
                    cart2: false,
                    cart3: false,
                    cart4: false,
                    cart5: false,
                    cart6: false,
                    cart7: false,
                    cart8: false,
                    cart9: false,
                    cart10: false,
                    cart11: false,
                  });
  
                  customerData.REENGAGEEMAILS = initializeEmails<ReengageEmails>({
                    reengage1: false,
                    reengage2: false,
                    reengage3: false,
                    reengage4: false,
                    reengage5: false,
                    reengage6: false,
                  });
  
                  customerData.emailUpdated = true; 
                  await customerData.save();
                }
              }
            } catch (err) {
              // console.error(`Error processing order ID ${line._id}:`, err.message);
            }
          })
        );
      } catch (error) {
        console.error("Error in New User Job:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: "Europe/London",
    }
  );

  cron.schedule('* */1 * * *', async () => {
    try {
        const _meal = await mealPack.find({available_quantity: 0, is_available: true});

        await Promise.all(_meal.map(async (m: any) => {
            await m.updateOne({ is_available: 'false' });            
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

  cron.schedule('* */1 * * *', async () => {
    try {
        const _meal = await mealPack.find({is_available: false});

        await Promise.all(_meal.map(async (m: any) => {
          if(m.available_quantity >= 1){
            await m.updateOne({ is_available: 'true' });            
          }
        }));
    } catch (error) {
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

  
export default cron
