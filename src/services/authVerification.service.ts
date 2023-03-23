import { Customer, customer, authVerification, AuthVerification } from "../models";
import { AuthVerificationReason } from "../valueObjects";
import { generate } from "voucher-code-generator";
import { getUpdateOptions, createError } from "../utils";

import addMinutes from "date-fns/addMinutes";
import { nanoid } from "nanoid";
// import EmailService, { Template } from "./email.service";

export class AuthVerificationService {
  static generateCode() {
    const code: string = generate({ charset: "1234567890", length: 5 })[0];
    return code;
  }

  static async generateResetToken(customer_id: string, reason: AuthVerificationReason) {
    const token = nanoid(24);
    const exp = addMinutes(Date.now(), 60).getTime();

    return await authVerification.findOneAndUpdate(
      { customer_id, reason },
      { customer_id, reason, exp, token },
      getUpdateOptions()
    );
  }

  // TODO: Send an the requested reset token to the email address
  async requestResetPassword(customer_id: string) {
    const reason = AuthVerificationReason.ACCOUNT_PASSWORD_RESET;
    let verification = await this.getPreviousVerificationIfValid(customer_id, reason);

    if (!verification) {
      verification = await AuthVerificationService.generateResetToken(customer_id, reason);
    }

    const acc = await customer.findById(customer_id).lean<Customer>().exec();
    if (!acc) throw createError("Customer not found", 404);

    // send reset email here
    // /reset?token={{token}}&sub={{customer_id}}
    // await EmailService.sendEmail("🥹 Reset password", acc?.email, Template.RESET_PASSWORD, {
    //   name: `${acc?.first_name}`,
    //   link: `https://rapydcars.com/password-reset?token=${verification?.token}&sub=${customer_id}`,
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

    // send email here.
    // await EmailService.sendEmail("📧 Verify your email address", acc?.email, Template.VERIFICATION, {
    //   code: verification?.code,
    //   name: `${acc?.first_name}`,
    //   link: `https://rapydcars.com/verify-email?code=${verification?.code}`,
    // });
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
      .select(["exp", "code", "token"])
      .lean<AuthVerification>()
      .exec();
    if (!verification) return null;
    const hasExpired = Date.now() > verification?.exp!;
    return !hasExpired ? verification : null;
  }
}
