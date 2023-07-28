import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { ReferralService } from "../services";

export default class CustomerEventListener {

  @addEvent("customer:referred")
  static async OnCustomerReferred({ invitee, inviter_refCode }: NourishaEventTypes["customer:referred"]) {
    // const customer_id = getCustomerId(owner);
    return await new ReferralService().createReferral(invitee as any, inviter_refCode);
  }

}
