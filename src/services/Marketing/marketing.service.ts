import { CustomerDto, UpdateContactSubscriptionDto } from "../../interfaces";
import { MailchimpService } from "./mailchimp.service";
import customer, { Address, Customer } from "../../models/customer";
import { SenderService } from "./sender.service";
import { mailJetSendMail } from "../../config/mailjet";

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


export async function welcomeEmail1(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Welcome to Nourisha ${cus.first_name}`;

  const body = `


  Dear ${cus.first_name}
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function welcomeEmail2(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Why Nourisha (why and how)`;

  const body = `


  Dear ${cus.first_name}
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function welcomeEmail3(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = 
  `
  ${cus.first_name}, is Nourisha Whetting Your Appetite?
`
;
  const body = 
  `
  Hey there, ${cus.first_name}!
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function welcomeEmail4(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Pssst🤭…We have a little welcome gift for you!
`;

  const body = `


  Dear ${cus.first_name}
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function welcomeEmail5(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = 
  `
  ${cus.first_name}, Ready for a Taste Adventure?  

`
;
  const body = 
  `
Dear NourishedFoodie,
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function welcomeEmail6(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `No subject provided`;

  const body = `


  Dear ${cus.first_name}
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function cartAbandonment1(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `${cus.first_name}, Your Delicious African Meal is Still Waiting for You!
`;
  const body = `
  Hello ${cus.first_name}
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function cartAbandonment2(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Still Thinking About Your Nourisha Feast?
`;
  const body = `
  Hey there, ${cus.first_name}
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function cartAbandonment3(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Hey  ${cus.first_name}, your Nourisha Meal Cart Misses You!

`;
  const body = `
  Hello ${cus.first_name},
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function subAbandonment1(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `${cus.first_name}, Your Nourisha Feast Awaits!
`;
  const body = `
  Hello ${cus.first_name},
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function subAbandonment2(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = ` Your Time is Precious - Let Us Handle Lunch & Dinner for You!

`;
  const body = `
  Hello there, ${cus.first_name},
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

export async function subAbandonment3(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Spice Up Your Food Game with Nourisha

`;
  const body = `
  Hey ${cus.first_name},
  `
;
  await mailJetSendMail(
    body,
    `${subject}`,
    [`${email}`]
  );
};

