import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { ReferralService } from "../services";
import { EmailQueue } from "../queues";

export default class CustomerEventListener {
  @addEvent("customer:referred")
  static async OnCustomerReferred({ invitee, inviter_refCode }: NourishaEventTypes["customer:referred"]) {
    // const customer_id = getCustomerId(owner);
    console.log("A new referral should be created!", { invitee, inviter_refCode });
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

  @addEvent("customer:send_resetpassword_email_web")
  static async OnSendResetPasswordEmailWeb(payload: NourishaEventTypes["customer:send_resetpassword_email_web"]) {
    EmailQueue.add("send_resetpassword_email_web", payload);
  }

  @addEvent("customer:send_resetpassword_email_mobile")
  static async OnSendResetPasswordEmailMobile(payload: NourishaEventTypes["customer:send_resetpassword_email_mobile"]) {
    EmailQueue.add("send_resetpassword_email_mobile", payload);
  }
}
