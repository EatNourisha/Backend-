import { CustomerDto, UpdateContactSubscriptionDto } from "../../interfaces";
import { MailchimpService } from "./mailchimp.service";
import { Address } from "../../models/customer";
import { SenderService } from "./sender.service";
// import customer, { Address } from "../../models/customer";
// import { lineup, order } from "../../models";
// import { cartAbandonment1 } from "./bluePrint.service";

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
    
//             if (Math.floor(minutesDifference) === 300) {
//                 console.log('5 hours welcome email 1')
//             }

//             if (Math.floor(daysDifference) === 2) {
//                 console.log('3 days welcome email 2')
//                 // await welcomeEmail2(_cus.email, {customer: _cus?._id})
//             }

//             if (Math.floor(daysDifference) === 4) {
//               console.log('5 day welcome email 3')
//                 // await welcomeEmail4(_cus.email, {customer: _cus?._id})
//             }
//             if (Math.floor(daysDifference) === 9) {
//               console.log('10 day welcome email 4')
//             //   await welcomeEmail5(_cus.email, {customer: _cus?._id})
//             }
//             if (Math.floor(daysDifference) === 14) {
//               console.log('15 day welcome email 5')
//             //   await welcomeEmail6(_cus.email, {customer: _cus?._id})
//             }
//             if (Math.floor(daysDifference) === 19) {
//               console.log('20 day welcome email 6')
//             //   await welcomeEmail7(_cus.email, {customer: _cus?._id})
//             }
//             if (Math.floor(daysDifference) === 24) {
//               console.log('25 day welcome email 7')
//             //   await welcomeEmail8(_cus.email, {customer: _cus?._id})
//             }

//         }


//     }
            
// }));

// } catch (error) {
//     console.error('Error updating settings:', error);
// }

// };
// export async function AllCartEmails(){

//   try {
//     const _orders = await order.find({status: 'processing'}).sort({createdAt:-1});

// await Promise.all(_orders.map(async (ord: any) => {
//     const _cus = await customer.findById(ord?.customer);
//     const _order = await order.findOne({customer: _cus?._id}).sort({createdAt:-1});

//     if(_order?.status === 'processing'){
//     if (_order?.createdAt) {
//         const createdAt = new Date(_order.createdAt);
//         const currentDate = new Date();

//         const timeDifference = currentDate.getTime() - createdAt.getTime();
//         const daysDifference = timeDifference / (1000 * 3600 * 24);
//         const minutesDifference = timeDifference / (1000 * 60); 
    
//         if (Math.floor(minutesDifference) === 10) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt: { $gte: _order.createdAt } });
    
//             let returning = false;
    
//             if (lineupExists) {
//                 returning = true;
//             }
//             if (!returning) {
//                 console.log('Cart abandonment email 1 sent');
//                 // await cartAbandonment1(_cus?.email!, {customer: _cus?._id})
//             }
//         }

//         if (Math.floor(daysDifference) === 3) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 console.log('Cart abandonment email 2 sent');
//                 await cartAbandonment1(_cus?.email!, {customer: _cus?._id, orderId: _order._id})

//             }

//             }
//         if (Math.floor(daysDifference) === 7) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 3 runs here
//                 // console.log('Cart abandonment email 3 sent');
//             }
//         }
//         if (Math.floor(daysDifference) === 11) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 4 runs here
//                 // console.log('Cart abandonment email 4 sent');
//             }

//         }
//         if (Math.floor(daysDifference) === 15) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 5 runs here
//                 // console.log('Cart abandonment email 5 sent');
//             }

//         }
//         if (Math.floor(daysDifference) === 19) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 6 runs here
//                 // console.log('Cart abandonment email 6 sent');
//             }

//         }

//         if (Math.floor(daysDifference) === 23) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 6 runs here
//                 // console.log('Cart abandonment email 7 sent');
//             }

//         }

//         if (Math.floor(daysDifference) === 27) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 6 runs here
//                 // console.log('Cart abandonment email 8 sent');
//             }

//         }

//         if (Math.floor(daysDifference) === 31) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 6 runs here
//                 // console.log('Cart abandonment email 9 sent');
//             }

//         }

//         if (Math.floor(daysDifference) === 35) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 6 runs here
//                 // console.log('Cart abandonment email 10 sent');
//             }

//         }

//         if (Math.floor(daysDifference) === 39) {
//             const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
    
//             let returning = false;
        
//             if ( lineupExists) {
//                 returning = true;
//             }
//             if (returning === false) {
//                 //  Cart Abdonment Email 6 runs here
//                 // console.log('Cart abandonment email 11 sent');
//             }

//         }

//     }


// }

            
// }));

// } catch (error) {
//     console.error('Error updating settings:', error);
// }

  
// }
// export async function AllPostSubEmails(){
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
//                     console.log('Post Subscription email 1 sent');
//                     // await postsub1(_cus?.email!, {customer: _cus?._id})
//                 }

//                 }
//             if (Math.floor(daysDifference) === 19) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 2 runs here
//                     console.log('Post Subscription email 2 sent');
//                 }
//             }
//             if (Math.floor(daysDifference) === 29) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 3 runs here
//                     console.log('Post Subscription email 3 sent');
//                 }

//             }
//             if (Math.floor(daysDifference) === 39) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 4 runs here
//                     console.log('Post Subscription email 4 sent');
//                 }

//             }
//             if (Math.floor(daysDifference) === 49) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 5 runs here
//                     console.log('Post Subscription email 5 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 59) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 6 runs here
//                     console.log('Post Subscription email 6 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 69) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 7 runs here
//                     console.log('Post Subscription email 7 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 79) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 8 runs here
//                     console.log('Post Subscription email 8 sent');
//                 }

//             }

//             if (Math.floor(daysDifference) === 89) {
//                 const lineupExists = await lineup.exists({ customer: _cus?._id, createdAt:  { $gte: _order.createdAt! } });
        
//                 let returning = false;
            
//                 if ( lineupExists) {
//                     returning = true;
//                 }
//                 if (returning === false) {
//                     //  Post Sub Email 8 runs here
//                     console.log('Post Subscription email 9 sent');
//                 }

//             }

//         }


//     }

                
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }


// }
// export async function AllReEngagementEmails(){
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
//                     console.log('Re-engagement email 1 sent');
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
//                     console.log('Re-engagement email 2 sent');
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
//                     console.log('Re-engagement email 3 sent');
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
//                     console.log('Re-engagement email 4 sent');
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
//                     console.log('Re-engagement email 5 sent');
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
//                     console.log('Re-engagement email 6 sent');
//                 }

//             }

//         }

//     }

                
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }

// }
// export async function AllCustomerRetentionEmails(){
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
//                     console.log('Sending customer retention email 1');
//                 }
//             }
//             if (monthsDifference === 2 && currentDate.getDate() === createdAt.getDate()) {
//                 if (_cus?.level === 'Newbie') {
//                         // Customer retention email 2 runs here
//                         console.log('Sending customer retention email 2');
//                     }
//                 } 
//                 if (monthsDifference === 3 && currentDate.getDate() === createdAt.getDate()) {
//                     if (_cus?.level === 'Newbie') {
//                         // Customer retention email 3 runs here 
//                         console.log('Sending customer retention email 3');
//                     }
//                 }
//              }
            
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }

// }
// export async function AllEmailCourseEmails(){
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
//                     console.log('Sending Email Course email 1');
//             }
//             if (monthsDifference === 2 && currentDate.getDate() === createdAt.getDate()) {
//                         // Email Course email 2 runs here
//                         console.log('Sending Email Course email 2');
//                 } 
//                 if (monthsDifference === 3 && currentDate.getDate() === createdAt.getDate()) {
//                         // Email Course email 3 runs here 
//                         console.log('Sending Email Course email 3');
//                 }
//                 if (monthsDifference === 4 && currentDate.getDate() === createdAt.getDate()) {
//                         // Email Course email 4 runs here 
//                         console.log('Sending Email Course email 3');
//                 }
//              }
            
//     }));

//     } catch (error) {
//         console.error('Error updating settings:', error);
//     }

// }
