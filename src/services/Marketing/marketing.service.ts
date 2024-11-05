import { CustomerDto, UpdateContactSubscriptionDto } from "../../interfaces";
import { MailchimpService } from "./mailchimp.service";
// import { Address } from "../../models/customer";
import { SenderService } from "./sender.service";
import customer, { Address } from "../../models/customer";
import { lineup, order } from "../../models";
import { customerRetention1, customerRetention2, customerRetention3, emailCourse1, emailCourse2, emailCourse3, emailCourse4, postsub1, postsub2, postsub3, postsub4, postsub5, postsub6, postsub7, postsub8, postsub9, Reengage1, Reengage2, Reengage3, Reengage4, Reengage5, Reengage6 } from "./bluePrint.service";

enum ChannelType {
  MAILCHIMP = "mailchimp",
  SENDER = "sender",
}

interface IMethod {
  addContact: (dto: CustomerDto) => Promise<any>;
  updateContactAddr: (email: string, dto: Address) => Promise<any>;
  syncCustomersToContacts: (roles: string[]) => Promise<any>;
  updateContactSubscription: (email: string, dto: UpdateContactSubscriptionDto) => Promise<any>;
}

type IMethodName = keyof IMethod;

export const TAGS = ["customer", "nourisha-api", "api-test"];

export class MarketingService {
  static channel: ChannelType = ChannelType.SENDER;

  static async addContact(dto: CustomerDto): Promise<any> {
    const method = this.selectMethod("addContact");
    if (!method) return;
    return await method(dto);
  }

  static async updateContactAddr(email: string, dto: Address): Promise<any> {
    const method = this.selectMethod("updateContactAddr");
    if (!method) return;
    return await method(email, dto);
  }

  static async updateContactSubscription(email: string, dto: UpdateContactSubscriptionDto): Promise<any> {
    const method = this.selectMethod("updateContactSubscription");
    if (!method) return;
    return await method(email, dto);
  }

  static async syncCustomersToContacts(roles: string[]): Promise<any> {
    const method = this.selectMethod("syncCustomersToContacts");
    if (!method) return;
    return await method(roles);
  }

  static selectMethod<N extends IMethodName>(method_name: N): IMethod[N] | null {
    switch (this.channel) {
      case ChannelType.MAILCHIMP:
        return MailchimpService[method_name as any];
      case ChannelType.SENDER:
        return SenderService[method_name as any];
      default:
        return null;
    }
  }
}

//****************************************************** */
// Marketing Email Blueprint
//****************************************************** */

// export async function AllWelcomeEmails() {

//   try {
//     const customers = await customer.find();

// await Promise.all(customers.map(async (cus: any) => {    
//     const _cus = await customer.findById(cus?._id);
    
//     const orderExists = await order.exists({ customer: cus?._id, status: "payment_received" });
//     const lineupExists = await lineup.exists({ customer: cus?._id });
    
//     let returning = false;
    
//     if (orderExists || lineupExists) {
//       returning = true;
//     }
    
//     if (returning === false) {
//       if (_cus?.createdAt) {
//             const createdAt = new Date(_cus.createdAt);
//             const currentDate = new Date();
    
//             const timeDifference = currentDate.getTime() - createdAt.getTime();
//             const daysDifference = timeDifference / (1000 * 3600 * 24);

//             const minutesDifference = timeDifference / (1000 * 60); 
    
//             if (Math.floor(minutesDifference) === 300 ) {
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || {};
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || { welcome2: false };
          
//               if (_cus.WELCOMEMAILS.welcome2 === false) {
//                   console.log('5 hours welcome email 2');
//                   await welcomeEmail2(_cus.email, { customer: _cus?._id });
//                   _cus.WELCOMEMAILS.welcome2 = true;
//               }
//             }

//             if (Math.floor(daysDifference) === 2) {
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || {};
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || { welcome3: false };
          
//               if (_cus.WELCOMEMAILS.welcome3 === false) {
//                   console.log('3 days welcome email 3');
//                   await welcomeEmail3(_cus.email, { customer: _cus?._id });
//                   _cus.WELCOMEMAILS.welcome3 = true;
//               }
//           }
          
           
//             if (Math.floor(daysDifference) === 4 ) {
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || {};
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || { welcome4: false };
          
//               if (_cus.WELCOMEMAILS.welcome4 === false) {
//                   console.log('5 days welcome email 4');
//                   await welcomeEmail4(_cus.email, { customer: _cus?._id });
//                   _cus.WELCOMEMAILS.welcome4 = true;
//               }
//             }
//             if (Math.floor(daysDifference) === 9) {
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || {};
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || { welcome5: false };
          
//               if (_cus.WELCOMEMAILS.welcome5 === false) {
//                   console.log('10 days welcome email 5');
//                   await welcomeEmail5(_cus.email, { customer: _cus?._id });
//                   _cus.WELCOMEMAILS.welcome5 = true;
//               }
//             }
//             if (Math.floor(daysDifference) === 14) {
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || {};
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || { welcome6: false };
          
//               if (_cus.WELCOMEMAILS.welcome6 === false) {
//                   console.log('15 days welcome email 6');
//                   await welcomeEmail6(_cus.email, { customer: _cus?._id });
//                   _cus.WELCOMEMAILS.welcome6 = true;
//               }
//             }
//             if (Math.floor(daysDifference) === 19 && _cus.WELCOMEMAILS.welcome7 === false) {
//               console.log('20 day welcome email 7')
//               await welcomeEmail7(_cus.email, {customer: _cus?._id}) 
//               _cus.WELCOMEMAILS.welcome7 = true
//               await _cus.save()
//             }
//             if (Math.floor(daysDifference) === 24) {
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || {};
//               _cus.WELCOMEMAILS = _cus.WELCOMEMAILS || { welcome8: false };
          
//               if (_cus.WELCOMEMAILS.welcome8 === false) {
//                   console.log('25 days welcome email 8');
//                   await welcomeEmail8(_cus.email, { customer: _cus?._id });
//                   _cus.WELCOMEMAILS.welcome8 = true;
//               }
//             }

//             await _cus.save()


//         }

    
//     }
            
// }));

// } catch (error) {
//     console.error('Error updating settings:', error);
// }

// };

export async function AllCartEmails(){

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
                // console.log('Cart abandonment email 1 sent');
                // await cartAbandonment1(_cus?.email!, {customer: _cus?._id})
            }
        }

        if (Math.floor(daysDifference) === 3) {
            const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
            let returning = false;
        
            if ( lineupExists) {
                returning = true;
            }
            if (returning === false) {
                // console.log('Cart abandonment email 2 sent');
                // await cartAbandonment2(_cus?.email!, {customer: _cus?._id, orderId: _order._id})

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
                // await cartAbandonment3(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
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
                // await cartAbandonment4(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
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
                // await cartAbandonment5(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
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
                // await cartAbandonment6(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
              }

        }

        if (Math.floor(daysDifference) === 23) {
            const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
            let returning = false;
        
            if ( lineupExists) {
                returning = true;
            }
            if (returning === false) {
                //  Cart Abdonment Email 7 runs here
                // await cartAbandonment7(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
              }

        }

        if (Math.floor(daysDifference) === 27) {
            const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
            let returning = false;
        
            if ( lineupExists) {
                returning = true;
            }
            if (returning === false) {
                //  Cart Abdonment Email 8 runs here
                // await cartAbandonment8(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
              }

        }

        if (Math.floor(daysDifference) === 31) {
            const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
            let returning = false;
        
            if ( lineupExists) {
                returning = true;
            }
            if (returning === false) {
                //  Cart Abdonment Email 9 runs here
                // await cartAbandonment9(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
              }

        }

        if (Math.floor(daysDifference) === 35) {
            const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
            let returning = false;
        
            if ( lineupExists) {
                returning = true;
            }
            if (returning === false) {
                //  Cart Abdonment Email 10 runs here
                // await cartAbandonment10(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
              }

        }

        if (Math.floor(daysDifference) === 39) {
            const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
            let returning = false;
        
            if ( lineupExists) {
                returning = true;
            }
            if (returning === false) {
                //  Cart Abdonment Email 6 runs here
                // await cartAbandonment1(_cus?.email!, {customer: _cus?._id, orderId: _order._id})
              }

        }

    }


}

            
}));

} catch (error) {
    console.error('Error updating settings:', error);
}

  
}

export async function AllPostSubEmails(){
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
        

            if (Math.floor(daysDifference) === 9) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
            
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    // console.log('Post Subscription email 1 sent');
                    await postsub1(_cus?.email!, {customer: _cus?._id})
                }

                }
            if (Math.floor(daysDifference) === 19) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                    // console.log('Post Subscription email 2 sent');
                    await postsub2(_cus?.email!, {customer: _cus?._id})

                }
            }
            if (Math.floor(daysDifference) === 29) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 3 sent');
                  await postsub3(_cus?.email!, {customer: _cus?._id})
                }

            }
            if (Math.floor(daysDifference) === 39) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 4 sent');
                  await postsub4(_cus?.email!, {customer: _cus?._id})
                }

            }
            if (Math.floor(daysDifference) === 49) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 5 sent');
                  await postsub5(_cus?.email!, {customer: _cus?._id})
                }

            }

            if (Math.floor(daysDifference) === 59) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 6 sent');
                  await postsub6(_cus?.email!, {customer: _cus?._id})
                }

            }

            if (Math.floor(daysDifference) === 69) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 7 sent');
                  await postsub7(_cus?.email!, {customer: _cus?._id})
                }

            }

            if (Math.floor(daysDifference) === 79) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 8 sent');
                  await postsub8(_cus?.email!, {customer: _cus?._id})
                }

            }

            if (Math.floor(daysDifference) === 89) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Post Subscription email 9 sent');
                  await postsub9(_cus?.email!, {customer: _cus?._id})

                }

            }

        }


    }

                
    }));

    } catch (error) {
        console.error('Error updating settings:', error);
    }


}
export async function AllReEngagementEmails(){
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
        

            if (Math.floor(daysDifference) === 13) {
              
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
            
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Re-engagement email 1 sent');
                  await Reengage1(_cus?.email!, {customer: _cus?._id})
                }

                }
            if (Math.floor(daysDifference) === 27) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Re-engagement email 2 sent');
                  await Reengage2(_cus?.email!, {customer: _cus?._id})
                }
            }
            if (Math.floor(daysDifference) === 41) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Re-engagement email 3 sent');
                  await Reengage3(_cus?.email!, {customer: _cus?._id})
                }

            }
            if (Math.floor(daysDifference) === 55) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Re-engagement email 4 sent');
                  await Reengage4(_cus?.email!, {customer: _cus?._id})
                }

            }
            if (Math.floor(daysDifference) === 69) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Re-engagement email 5 sent');
                  await Reengage5(_cus?.email!, {customer: _cus?._id})
                }

            }

            if (Math.floor(daysDifference) === 83) {
                const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
                let returning = false;
            
                if ( lineupExists) {
                    returning = true;
                }
                if (returning === false) {
                  // console.log('Re-engagement email 6 sent');
                  await Reengage6(_cus?.email!, {customer: _cus?._id})
                }

            }

        }

        await _cus?.save()

    }

                
    }));

    } catch (error) {
        console.error('Error updating settings:', error);
    }

}

    // export async function AllReEngagementEmails() {
    //   try {
    //       const _orders = await order.find({ status: 'processing' }).sort({ createdAt: -1 });

    //       await Promise.all(_orders.map(async (ord: any) => {
    //           try {
    //               const _cus = await customer.findById(ord?.customer);
    //               if (!_cus) return;

    //               const _order = await order.findOne({ customer: _cus._id }).sort({ createdAt: -1 });
    //               if (!_order || _order.status !== 'processing' || !_order.createdAt) return;

    //               const createdAt = new Date(_order.createdAt);
    //               const currentDate = new Date();
    //               const timeDifference = currentDate.getTime() - createdAt.getTime();
    //               const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    //               const lineupExists = await lineup.exists({ customer: _cus._id, createdAt: { $gte: _order.createdAt } });
    //               if (lineupExists) return;

    //               switch (daysDifference) {
    //                   case 13:
    //                       console.log('Re-engagement email 1 sent');

    //                       _cus.REENGAGEEMAILS = _cus.REENGAGEEMAILS || {};
    //                       _cus.REENGAGEEMAILS = _cus.REENGAGEEMAILS || { reengage1: false };
                      
    //                       if (_cus.REENGAGEEMAILS.reengage1 === false) {
    //                           console.log('14 days welcome email 1');
    //                           await welcomeEmail2(_cus.email, { customer: _cus?._id });
    //                           _cus.REENGAGEEMAILS.reengage1 = true;
    //                           await _cus?.save()

    //                           console.log('Re- email 1 sent', _cus.REENGAGEEMAILS.reengage1);

    //                       }
    //                       // await Reengage1(_cus.email, { customer: _cus._id });
    //                       break;
    //                   case 27:
    //                       console.log('Re-engagement email 2 sent');
    //                       // await Reengage2(_cus.email, { customer: _cus._id });
    //                       break;
    //                   case 41:
    //                       console.log('Re-engagement email 3 sent');
    //                       // await Reengage3(_cus.email, { customer: _cus._id });
    //                       break;
    //                   case 55:
    //                       console.log('Re-engagement email 4 sent');
    //                       // await Reengage4(_cus.email, { customer: _cus._id });
    //                       break;
    //                   case 69:
    //                       console.log('Re-engagement email 5 sent');
    //                       // await Reengage5(_cus.email, { customer: _cus._id });
    //                       break;
    //                   case 83:
    //                       console.log('Re-engagement email 6 sent');
    //                       // await Reengage6(_cus.email, { customer: _cus._id });
    //                       break;

    //                     }
    //                     await _cus?.save()
    //           } catch (err) {
    //               console.error("Error processing order:", ord._id, err);
    //           }
    //       }));
    //   } catch (err) {
    //       console.error("Error fetching orders:", err);
    //   }
    // }

export async function AllCustomerRetentionEmails(){
    try {
        const customers = await customer.find();

    await Promise.all(customers.map(async (cus: any) => {
        const _cus = await customer.findById(cus?._id);
                
            if (_cus?.createdAt) {
              const createdAt = new Date(_cus.createdAt);
              const currentDate = new Date();
          
              const monthsDifference = 
                  (currentDate.getFullYear() - createdAt.getFullYear()) * 12 +
                  (currentDate.getMonth() - createdAt.getMonth());
          
              if (monthsDifference === 1 && currentDate.getDate() === createdAt.getDate() && 
                  currentDate.getHours() === createdAt.getHours() && 
                  currentDate.getMinutes() === createdAt.getMinutes()) {
                  
                  if (_cus?.level === 'Newbie' || _cus?.level === null) {
                      console.log('Sending customer retention email 1');
                      await customerRetention1(_cus?.email!, { customer: _cus?._id });
                  }
              }
          
              if (monthsDifference === 2 && currentDate.getDate() === createdAt.getDate() && 
                  currentDate.getHours() === createdAt.getHours() && 
                  currentDate.getMinutes() === createdAt.getMinutes()) {
                  
                  if (_cus?.level === 'Newbie' || _cus?.level === null) {
                      console.log('Sending customer retention email 2');
                      await customerRetention2(_cus?.email!, { customer: _cus?._id });
                  }
              }
          
              if (monthsDifference === 3 && currentDate.getDate() === createdAt.getDate() && 
                  currentDate.getHours() === createdAt.getHours() && 
                  currentDate.getMinutes() === createdAt.getMinutes()) {
                  
                  if (_cus?.level === 'Newbie' || _cus?.level === null) {
                      console.log('Sending customer retention email 3');
                      await customerRetention3(_cus?.email!, { customer: _cus?._id });
                  }
              }
          }
          
    }));

    } catch (error) {
        console.error('Error updating settings:', error);
    }

}
export async function AllEmailCourseEmails(){
    try {
        const customers = await customer.find();

    await Promise.all(customers.map(async (cus: any) => {
        const _cus = await customer.findById(cus?._id);

            if (_cus?.createdAt) {
                const createdAt = new Date(_cus.createdAt);
                const currentDate = new Date();
        
                const monthsDifference = 
                (currentDate.getFullYear() - createdAt.getFullYear()) * 12 +
                (currentDate.getMonth() - createdAt.getMonth());
            
            if (monthsDifference === 1 && currentDate.getDate() === createdAt.getDate()) {
              await emailCourse1(_cus?.email!, {customer: _cus?._id})
            }
            if (monthsDifference === 2 && currentDate.getDate() === createdAt.getDate()) {
              await emailCourse2(_cus?.email!, {customer: _cus?._id})
                } 
                if (monthsDifference === 3 && currentDate.getDate() === createdAt.getDate()) {
                  await emailCourse3(_cus?.email!, {customer: _cus?._id})
                }
                if (monthsDifference === 4 && currentDate.getDate() === createdAt.getDate()) {
                  await emailCourse4(_cus?.email!, {customer: _cus?._id})
                }
             }
            
    }));

    } catch (error) {
        console.error('Error updating settings:', error);
    }

}
