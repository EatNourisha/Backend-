import { Customer, customer, authVerification, AuthVerification } from "../models";
import { AuthVerificationReason } from "../valueObjects";
import { generate } from "voucher-code-generator";
import { getUpdateOptions, createError } from "../utils";

import addMinutes from "date-fns/addMinutes";
import { nanoid } from "nanoid";
// import { EmailService, Template } from "./email.service";
// import { isTesting } from "../config";
import { NourishaBus } from "../libs";
import { sendMobilResetEmail, sendWelcomeEmail } from "./authEmail.service";
// import { EmailQueue } from "../queues";
// import EmailService, { Template } from "./email.service";

export class AuthVerificationService {
  static generateCode() {
    const code: string = generate({ charset: "1234567890", length: 5 })[0];
    return code;
  }

  static async generateResetToken(customer_id: string, reason: AuthVerificationReason) {
    const token = nanoid(24);
    const exp = addMinutes(Date.now(), 60).getTime();

    return await authVerification.findOneAndUpdate({ customer_id, reason }, { customer_id, reason, exp, token }, getUpdateOptions());
  }

  /** Starting point for resetting password on mobile devices
   ** A user requests an OTP
   ** After receiving the OTP, the user sends a request to verify the OTP to make 
      sure the user is valid and requesting to change his/her own account's password and not others.
   ** After a successful validation, the backend sends the token and user's ID for changing the password
  */
  async requestResetPasswordOTP__Mobile(email: string) {
    const reason = AuthVerificationReason.ACCOUNT_RESET_VERIFICATION;
    const timeout = 60; // in minutes, should be 60 -> 1hr

    const acc = await customer.findOne({ email }).lean<Customer>().exec();
    if (!acc) throw createError("Customer not found", 404);

    const customer_id = acc?._id!;
    let verification = await this.getPreviousVerificationIfValid(customer_id, reason);

    if (!verification) {
      const exp = addMinutes(Date.now(), timeout).getTime(),
        code = AuthVerificationService.generateCode();
      verification = await authVerification.findOneAndUpdate(
        { customer_id, reason },
        { customer_id, reason, exp, code },
        getUpdateOptions()
      );
    }

    // send email here.
    const payload = {
      email: acc?.email!,
      code: verification?.code!,
      name: `${acc?.first_name}`,
      link: `https://eatnourisha.com/verification?code=${verification?.code}`,
    };

    // await NourishaBus.emit("customer:send_resetpassword_email_mobile", payload);

    await sendMobilResetEmail(payload.email, payload, false)
    // EmailQueue.add({type: "send_verification_email", ...payload})
    // if(!isTesting) await EmailService.sendEmail("📧 Verify your email address", acc?.email, Template.VERIFICATION, {...payload});
    console.log("\nEMAIL VERIFICATION CODE", verification?.code);

    return verification as AuthVerification;
  }

  async validatePasswordResetOTP(code: string) {
    const verification = await authVerification
      .findOne({ code, reason: AuthVerificationReason.ACCOUNT_RESET_VERIFICATION })
      .select(["exp", "code", "customer_id"])
      .lean<AuthVerification>()
      .exec();

    if (!verification) throw createError("Password reset OTP invalid", 401);
    else if (!!verification && Date.now() > verification?.exp!) throw createError("Password reset OTP expired", 401);

    console.log("Verification", verification);

    // Generate a reset password token and send it back to the mobile device.
    return await this.requestResetPassword(verification?.customer_id as string, false);
  }

  // TODO: Send an the requested reset token to the email address
  async requestResetPassword(customer_id: string, send_email = true) {
    const reason = AuthVerificationReason.ACCOUNT_PASSWORD_RESET;
    let verification = await this.getPreviousVerificationIfValid(customer_id, reason);

    if (!verification) {
      verification = await AuthVerificationService.generateResetToken(customer_id, reason);
    }

    const acc = await customer.findById(customer_id).lean<Customer>().exec();
    if (!acc) throw createError("Customer not found", 404);

    // send reset email here
    // /reset?token={{token}}&sub={{customer_id}}
    if (send_email)
      await NourishaBus.emit("customer:send_resetpassword_email_web", {
        email: acc?.email!,
        name: acc?.first_name!,
        token: verification?.token!,
        sub: customer_id,
        link: `https://eatnourisha.com/reset?token=${verification?.token}&sub=${customer_id}`,
      });
    // await EmailService.sendEmail("🥹 Reset password", acc?.email, Template.RESET_PASSWORD, {
    //   name: `${acc?.first_name}`,
    //   link: `https://eatnourisha.com/reset?token=${verification?.token}&sub=${customer_id}`,
    // });
    console.log("RESET TOKEN", `?token=${verification?.token}&sub=${customer_id}`);

    return verification as AuthVerification;
  }

  /* TODO:
   *  send code via email to the user's email address ✅
   */
  async requestEmailVerification(customer_id: string, reason: AuthVerificationReason): Promise<AuthVerification> {
    const timeout = 60; // in minutes, should be 60 -> 1hr

    const acc = await customer.findById(customer_id).lean<Customer>().exec();
    if (!acc) throw createError("Customer not found", 404);

    let verification = await this.getPreviousVerificationIfValid(customer_id, reason);
    if (!verification) {
      const exp = addMinutes(Date.now(), timeout).getTime(),
        code = AuthVerificationService.generateCode();
      verification = await authVerification.findOneAndUpdate(
        { customer_id, reason },
        { customer_id, reason, exp, code },
        getUpdateOptions()
      );
    }

    // send email here
    // const payload = {
    //   email: acc?.email!,
    //   code: verification?.code!,
    //   name: `${acc?.first_name}`,
    //   link: `https://eatnourisha.com/verification?code=${verification?.code}`,
    // };

    // await NourishaBus.emit("customer:send_verification_email", payload);

    // send welcome email instead, since emails are not verified on the mobile app at the moment

    const payload ={
      email: acc?.email!, 
      name: acc?.first_name!
    }

    // NourishaBus.emit("customer:send_welcome_email", { email: acc?.email!, name: acc?.first_name! });
    await sendWelcomeEmail(payload.email, payload, false)
    // EmailQueue.add({type: "send_verification_email", ...payload})
    // if(!isTesting) await EmailService.sendEmail("📧 Verify your email address", acc?.email, Template.VERIFICATION, {...payload});
    console.log("\nEMAIL VERIFICATION CODE", verification?.code);

    return verification as AuthVerification;
  }

  public async getResetToken(
    customer_id: string,
    reason: AuthVerificationReason,
    token: string,
    verify = false
  ): Promise<AuthVerification> {
    let verification = await authVerification.findOne({ customer_id, reason }).select(["token", "exp"]).lean().exec();
    if (!verification) throw createError("Reset token not requested", 400);

    if (Date.now() > verification?.exp!) throw createError("Reset token has expired. Please request another one", 400);
    if (token !== verification.token) throw createError("Invalid token", 400);

    if (verify) {
      const updatePayload = verify ? { verified: true } : {};

      verification = await authVerification.findByIdAndUpdate(verification._id, updatePayload, { new: true }).lean().exec();
    }
    return verification as AuthVerification;
  }

  public async getEmailVerification(
    customer_id: string,
    reason: AuthVerificationReason,
    code: string,
    verify = false
  ): Promise<AuthVerification> {
    let verification = await authVerification.findOne({ customer_id, reason }).select(["code", "exp"]).lean().exec();
    if (!verification) throw createError("Verification not requested", 400);

    if (Date.now() > verification?.exp!) throw createError("Verification has expired. Please request another one", 400);
    if (code !== verification.code) throw createError("Incorrect code", 400);

    if (verify) {
      const updatePayload = verify ? { verified: true } : {};

      verification = await authVerification.findByIdAndUpdate(verification._id, updatePayload, { new: true }).lean().exec();
    }
    return verification as AuthVerification;
  }

  public async removeVerification(id: string): Promise<boolean> {
    return Boolean(await authVerification.findByIdAndDelete(id).select("_id").lean().exec());
  }

  async getPreviousVerificationIfValid(customer_id: string, reason: AuthVerificationReason): Promise<AuthVerification | null> {
    const verification = await authVerification
      .findOne({ customer_id, reason })
      .select(["exp", "code", "token", "customer_id"])
      .lean<AuthVerification>()
      .exec();
    if (!verification) return null;
    const hasExpired = Date.now() > verification?.exp!;
    return !hasExpired ? verification : null;
  }
}
