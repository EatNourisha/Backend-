// @ts-nocheck

import { compareSync, hashSync } from "bcryptjs";
import { createError } from "../utils";
import { customer, Customer } from "../models";
import { ChangePasswordDto, ResetPasswordDto } from "../interfaces";

abstract class IPasswordService {
  getPassword(customer_id: string): Promise<string>;
  addPassword(customer_id: string, password: string): Promise<Customer>;
  checkPassword(customer_id: string, password: string): Promise<boolean>;
  resetPassword(customer_id: string, input: ResetPasswordDto): Promise<boolean>;
  changePassword(customer_id: string, input: ChangePasswordDto): Promise<Customer>;
}

export default class PasswordService implements IPasswordService {
  static async getPassword(customer_id: string): Promise<string> {
    const acc = await customer.findOne({ _id: customer_id }).select("password").lean().exec();
    if (!acc) throw createError("Customer not found", 404);

    return acc.password;
  }

  static async addPassword(customer_id: string, password: string): Promise<Customer> {
    const acc = await customer
      .findByIdAndUpdate(customer_id, { password: hashSync(password, 8) }, { useFindAndModify: false })
      .lean()
      .exec();
    if (!acc) throw createError("Customer not found", 404);
    return acc;
  }

  static async changePassword(customer_id: string, input: ChangePasswordDto): Promise<Customer> {
    if (!(await this.checkPassword(customer_id, input.current_password))) throw createError("Incorrect password", 401);

    const acc = await customer
      .findByIdAndUpdate(customer_id, { password: hashSync(input.new_password, 8) }, { useFindAndModify: false })
      .lean()
      .exec();
    return acc;
  }

  static async checkPassword(customer_id: string, password: string): Promise<boolean> {
    const passwordHashInDb = await this.getPassword(customer_id);
    return compareSync(password, passwordHashInDb);
  }
}
