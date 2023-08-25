import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { ReferralService } from "../services";
import { EmailQueue } from "../queues";

export default class CustomerEventListener {
  @addEvent("customer:referred")
  static async OnCustomerReferred({ invitee, inviter_refCode }: NourishaEventTypes["customer:referred"]) {
    // const customer_id = getCustomerId(owner);
    return await new ReferralService().createReferral(invitee as any, inviter_refCode);
  }

  @addEvent("customer:send_verification_email")
  static async OnSendVerificationEmail(payload: NourishaEventTypes["customer:send_verification_email"]) {
    EmailQueue.add("send_verification_email", payload);
    // const jobs = await EmailQueue.getJobs(['waiting']);
    // console.log("customer:send_verification_email", payload);
  }

  @addEvent("customer:send_welcome_email")
  static async OnSendWelcomeEmail(payload: NourishaEventTypes["customer:send_welcome_email"]) {
    EmailQueue.add("send_welcome_email", payload);
  }

  @addEvent("customer:send_resetpassword_email")
  static async OnSendResetPasswordEmail(payload: NourishaEventTypes["customer:send_resetpassword_email"]) {
    EmailQueue.add("send_resetpassword_email", payload);
  }
}
