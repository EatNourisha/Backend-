// @ts-nocheck

import { sign, verify } from "jsonwebtoken";
import { createError, getUpdateOptions, setExpiration, validateFields } from "../utils";
import { AuthPayload, Auth, loginDto, registerDto, ResetPasswordDto, ChangePasswordDto } from "../interfaces";
import { authToken, authVerification, Customer, customer } from "../models";
import { CustomerService, RoleService, PasswordService, AuthVerificationService, EmailService, Template } from "../services";
import config, { isTesting } from "../config";
import { AuthVerificationReason, AvailableRole } from "../valueObjects";
import { NourishaBus } from "../libs";

export class AuthService {
  private customerService = new CustomerService();

  async login(data: loginDto, device_id: string, admin = false): Promise<Auth> {
    // validateFields(data);
    console.log("DEVICE ID", device_id);
    const acc = await this.customerService.findByLogin(data.email, data.password, admin);
    const payload = AuthService.transformUserToPayload(acc);
    const { token, expiration } = await this.addToken(payload, device_id);
    payload.exp = expiration;

    await NourishaBus.emit("customer:logged_in", { owner: acc });
    return { payload, token };
  }

  async register(data: registerDto, device_id: string, roles?: string[], isAdminReg = false): Promise<Auth> {
    if (await this.customerService.checkEmailExists(data.email)) throw createError("Email already exist", 400);
    const acc = await this.customerService.createCustomer(data, roles, isAdminReg);
    const payload = AuthService.transformUserToPayload(acc);

    const { token, expiration } = await this.addToken(payload, device_id);

    payload.exp = expiration;
    if (!isAdminReg) await this.requestEmailVerification(acc?._id);
    return { payload, token };
  }

  async registerWithRole(data: registerDto, role: AvailableRole, device_id: string): Promise<Auth | null> {
    validateFields(data, ["email", "first_name", "last_name", "password", "phone"]);
    if (await this.customerService.checkEmailExists(data.email)) throw createError("Email already exist", 400);

    const _role = await RoleService.getRoleBySlug(role);
    const acc = await this.customerService.createCustomer(data, [_role?._id]);
    // TODO: add the referral service then use the refer code to perform some referral task
    // // if (data?.refCode) await ReferralService.createRef(data.refCode, acc?._id);
    const payload = AuthService.transformUserToPayload(acc);
    const { token, expiration } = await this.addToken(payload, device_id);
    payload.exp = expiration;

    console.log(`Registered new user with refCode ${acc?.ref_code}`);
    await this.requestEmailVerification(acc?._id);
    return { payload, token };
  }

  public async requestEmailVerification(customer_id: string): Promise<{ message: string }> {
    const result = await new AuthVerificationService().requestEmailVerification(customer_id, AuthVerificationReason.ACCOUNT_VERIFICATION);
    if (isTesting) return result;
    return { message: "Verification code sent" };
  }

  async verifyEmail(customer_id: string, code: string, roles: string[], device_id: string): Promise<Auth> {
    const acc = await this.customerService.verifyEmail({ customer_id, code }, roles);
    const payload = AuthService.transformUserToPayload(acc);
    const { token, expiration } = await this.addToken(payload, device_id);
    payload.exp = expiration;

    // send email here.

    if(!isTesting) await EmailService.sendEmail("Welcome to Nourisha", acc?.email, Template.WELCOME, {
      name: `${acc?.first_name}`,
    });

    return { payload, token };
  }

  async validateAuthCode(token: string, device_id: string): Promise<AuthPayload> {
    const auth = await authToken.findOne({ token, device_id }).select("token").lean().exec();
    if (!auth) throw createError("Authorization code is invalid", 401);
    const payload: AuthPayload = verify(auth.token, config.JWT_SECRET, {
      audience: config.JWT_AUDIENCE,
    }) as AuthPayload;
    if (Date.now() > (payload.exp as number)) throw createError("Token expired", 401);
    return payload;
  }

  async requestResetPasswordToken(email: string) {
    const acc = await customer.findOne({ email }).select("_id").lean().exec();
    if (!acc) throw createError("Customer not found", 404);
    const result = await new AuthVerificationService().requestResetPassword(acc._id);
    if (isTesting) return result;
    return { message: "Reset link has been sent to your email" };
  }

  async resetPassword(input: ResetPasswordDto) {
    const acc = await this.customerService.resetPassword(input);
    await AuthService.invalidateAuthCode(input.customer_id);
    return acc;
  }

  static async invalidateAuthCode(customer_id: string): Promise<boolean> {
    return Boolean(await authToken.findOneAndUpdate({ customer_id }, { token: "", exp: 0 }).select("_id").lean().exec());
  }

  private async addToken(payload: AuthPayload, device_id: string): Promise<{ token: string; expiration: number }> {
    const jwt = AuthService.generateToken(payload);
    await authToken
      .findOneAndUpdate(
        { customer_id: payload.sub, device_id },
        {
          token: jwt.token,
          last_login: new Date(),
          exp: jwt.expiration,
          device_id,
        },
        getUpdateOptions()
      )
      .lean()
      .exec();
    return jwt;
  }

  private static generateToken(payload: AuthPayload): {
    token: string;
    expiration: number;
  } {
    const expiration = setExpiration(14); // token is set to expire in 14 days
    const token = sign({ ...payload }, config.JWT_SECRET, {
      audience: config.JWT_AUDIENCE,
      expiresIn: expiration,
    });
    return { token, expiration };
  }

  private static transformUserToPayload(acc: Customer): AuthPayload {
    return {
      sub: acc._id as string,
      email: acc.email,
      roles: acc.roles as string[],
      is_verified: acc?.is_email_verified,
    };
  }
}
