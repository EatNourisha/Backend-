import { CustomerDto, UpdateContactSubscriptionDto } from "../../interfaces";
import { MailchimpService } from "./mailchimp.service";
import { Address } from "../../models/customer";
import { SenderService } from "./sender.service";

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

export const TAGS = ["customer", "nourisha-api"];

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
