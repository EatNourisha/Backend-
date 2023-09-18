import Stripe from "stripe";
import { nanoid } from "nanoid";
import {
  AddCustomerAllergiesDto,
  ChangePasswordDto,
  CustomerDto,
  IPaginationFilter,
  PaginatedDocument,
  ResetPasswordDto,
  SetDeliveryDayDto,
  UpdateCustomerDto,
  VerifyEmailDto,
} from "../interfaces";
import { NourishaBus } from "../libs";
import { customer, Customer, deletedCustomer, DeliveryDay, FCMToken, mealPack, subscription } from "../models";
import { createError, paginate, removeForcedInputs, validateFields } from "../utils";
import { AuthVerificationReason, AvailableResource, AvailableRole, PermissionScope } from "../valueObjects";
import PasswordService from "./password.service";
import { RoleService } from "./role.service";

import isEmpty from "lodash/isEmpty";
import difference from "lodash/difference";
import { AuthVerificationService } from "./authVerification.service";
import config from "../config";
import { join, uniq } from "lodash";
import { NotificationService } from "./Preference/notification.service";
import CustomerEventListener from "../listeners/customer.listener";
import { DeliveryService } from "./Meal/delivery.service";
// import { when } from "../utils/when";

export class CustomerService {
  private authVerificationService = new AuthVerificationService();
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async getFeatureCounts(roles: string[]): Promise<{ meals: number; customers: number; subscriptions: number }> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [PermissionScope.ALL]);

    const [meals, customers, subscriptions] = await Promise.all([
      mealPack.countDocuments().lean<number>().exec(),
      customer.countDocuments({ primary_role: "customer" }).lean<number>().exec(),
      subscription.countDocuments({ status: "active" }).lean<number>().exec(),
    ]);

    // console.log('Dashboard', {meals, customers, subscriptions})

    return { meals, customers, subscriptions };
  }

  async createCustomer(input: CustomerDto, roles?: string[]): Promise<Customer> {
    let acc = (await customer.create({
      ...input,
      control: { enabled: true },
      ref_code: nanoid(7).toLowerCase(),
      roles: roles ?? [],
      is_email_verified: false,
    })) as Customer;

    await Promise.allSettled([
      PasswordService.addPassword(acc._id!, input.password),
      this.attachStripeId(acc?._id!, input?.email, join([input?.first_name, input?.last_name], " ")),
      roles && roles[0] && this.updatePrimaryRole(acc._id!, roles[0], []),
    ]);

    acc = (await customer.findById(acc._id).lean().exec()) as Customer;
    if (!!acc && !!input?.ref_code) await NourishaBus.emit("customer:referred", { invitee: acc?._id!, inviter_refCode: input?.ref_code });
    await NourishaBus.emit("customer:created", { owner: acc });
    return acc;
  }

  async setDeliveryDay(customer_id: string, dto: SetDeliveryDayDto, roles: string[]): Promise<Customer> {
    validateFields(dto, ["delivery_day"]);

    const supported_days = Object.values(DeliveryDay);
    if (!supported_days.includes(dto.delivery_day)) throw createError(`Available delivery days are ${supported_days.join(", ")}`, 400);

    await RoleService.requiresPermission([AvailableRole.CUSTOMER], roles, AvailableResource.CUSTOMER, [PermissionScope.READ]);

    const [_customer] = await Promise.all([
      customer
        .findByIdAndUpdate(customer_id, { ...dto }, { new: true })
        .lean<Customer>()
        .exec(),
      DeliveryService.updateDeliveryDayOfWeek(customer_id, dto?.delivery_day),
    ]);

    if (!_customer) throw createError(`Customer not found`, 404);
    return _customer;
  }

  async getCustomers(
    roles: string[],
    filters?: IPaginationFilter & {
      has_lineup?: boolean;
      has_subscription?: boolean;
      searchPhrase?: string;
      nin_roles: string;
      populate: string;
    }
  ): Promise<PaginatedDocument<Customer[]>> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    let queries: any = {};
    // let options: QueryOptions<any> = {}
    if (!!filters?.searchPhrase) Object.assign(queries, { $text: { $search: filters?.searchPhrase } });
    if (filters?.has_lineup) Object.assign(queries, { lineup: { $exists: Boolean(filters?.has_lineup) } });
    if (filters?.has_subscription) {
      Object.assign(queries, { subscription: { $exists: Boolean(filters?.has_lineup) }, "subscription.status": { $eq: "active" } });
      // Object.assign(options, {populate: [{path: 'subscription', populate: ['plan']}]})
    }

    // Roles not-in(nin) customers `roles` array field
    if (!!filters?.nin_roles) {
      const role_names = String(filters.nin_roles).split(",");
      const roles = (await RoleService.getRoleBySlugs(role_names)).map((r) => r?._id);
      Object.assign(queries, { roles: { $nin: roles } });
    }

    return paginate("customer", queries, filters, {
      populate: [{ path: "subscription", populate: ["plan"] }, { path: "preference.allergies" }, { path: "roles" }],
    });
  }

  async getCustomerById(customer_id: string, roles: string[]): Promise<Customer> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);
    const cus = await customer
      .findById(customer_id)
      .populate([{ path: "subscription", populate: ["plan"] }, "lineup"])
      .lean<Customer>()
      .exec();
    if (!cus) throw createError("Customer not found", 404);
    return cus;
  }

  async getActiveSubscription(customer_id: string, roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.CUSTOMER], roles, AvailableResource.CUSTOMER, [PermissionScope.READ]);
    const cus = await customer
      .findById(customer_id)
      .select(["first_name", "subscription"])
      .populate("subscription")
      .lean<Customer>()
      .exec();

    if (!cus) throw createError("Customer does not exist", 404);
    if (!cus?.subscription) return { message: "No active subscription found" };

    return cus?.subscription;
  }

  static async removeDeprecatedCustomerRoles(customer_id: string, roles: string[]) {
    const toRun: any = [];
    const role = await RoleService.getRoleByIds(roles);
    const existingCustomerRolesInDb = role?.map((r) => String(r._id));

    const rolesToDelete = difference(roles, existingCustomerRolesInDb);
    if (!isEmpty(rolesToDelete)) {
      rolesToDelete.forEach((roleId) => toRun.push(new RoleService().unassignRole(roleId, customer_id, false)));
      return await Promise.all(toRun);
    }

    return [];
  }

  async currentUserCustomer(id: string, roles: string[]) {
    const toRun = [
      CustomerService.removeDeprecatedCustomerRoles(id, roles),
      RoleService.requiresPermission([AvailableRole.CUSTOMER, AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
        PermissionScope.READ,
        PermissionScope.ALL,
      ]),
      RoleService.isAdmin(roles),
    ];
    const [_, __, isAdminResult] = await Promise.allSettled(toRun);
    // const {value: isAdmin} = (isAdminResult ?? {}) as any;

    console.log("Is Admin", isAdminResult);

    let data = await customer.findById(id).lean<Customer>().exec();
    if (!data) throw createError(`Not found`, 404);

    if (!data?.stripe_id) {
      data = await this.attachStripeId(data?._id!, data?.email, join([data?.first_name, data?.last_name], " "));
    }

    if (!data?.ref_code)
      data = await customer
        .findByIdAndUpdate(id, { ref_code: nanoid(5) }, { new: true })
        // .populate({path: 'roles', model: 'roles'})
        .lean<Customer>()
        .exec();

    return data;
  }

  async updatePrimaryRole(id: string, role: string, roles: string[], dryRun = true): Promise<Customer> {
    if (!dryRun)
      await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
        PermissionScope.UPDATE,
        PermissionScope.ALL,
      ]);

    const res = await RoleService.getRoleById(role);
    const acc = (await customer.findOneAndUpdate({ _id: id }, { primary_role: res.slug }, { new: true }).lean().exec()) as Customer;
    if (!acc) throw createError("Customer not found", 404);
    return acc;
  }

  async attachStripeId(id: string, email: string, name: string) {
    const cons = await this.stripe.customers.create({
      email,
      name,
    });

    const acc = await customer.findByIdAndUpdate(id, { stripe_id: cons.id }, { new: true }).lean<Customer>().exec();
    return acc;
  }

  async deleteCustomer(id: string, dto: { reason: string }, roles: string[]) {
    validateFields(dto, ["reason"]);
    await RoleService.requiresPermission([AvailableRole.CUSTOMER], roles, AvailableResource.CUSTOMER, [
      PermissionScope.DELETE,
      PermissionScope.ALL,
    ]);

    const cus = await customer.findById(id).lean<Customer>().exec();
    if (!cus) throw createError("Account not found", 404);

    await deletedCustomer.create({ ...cus, deletion_reason: dto?.reason });
    // await NourishaBus.emit("customer:deleted", { owner: data, modifier: sub });

    return await customer.deleteOne({ _id: id }).lean().exec();
  }

  async updateCustomer(id: string, roles: string[], input: UpdateCustomerDto) {
    input = CustomerService.removeUpdateForcedInputs(input);
    if (isEmpty(input)) throw createError("No valid input", 404);

    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
    const data = await customer
      .findOneAndUpdate({ _id: id }, { ...input }, { new: true })
      .lean()
      .exec();
    if (!data) throw createError(`Customer not found`, 404);
    return data;
  }

  async addCustomerAllergies(id: string, dto: AddCustomerAllergiesDto, roles: string[]) {
    validateFields(dto, ["allergies"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
    let cus = await customer.findById(id).select("preference").lean<Customer>().exec();
    if (!cus) throw createError(`Customer not found`, 404);

    const allergies = uniq([...(cus?.preference?.allergies ?? []), ...(dto.allergies ?? [])]);
    cus = await customer.findByIdAndUpdate(id, { preference: { allergies } }, { new: true }).lean<Customer>().exec();
    return cus;
  }

  async removeCustomerAllergies(id: string, dto: AddCustomerAllergiesDto, roles: string[]) {
    validateFields(dto, ["allergies"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
    let cus = await customer.findById(id).select("preference").lean<Customer>().exec();
    if (!cus) throw createError(`Customer not found`, 404);

    const allergies = difference(cus?.preference?.allergies ?? [], dto.allergies ?? []);

    console.log("Allergies to remove", allergies);
    cus = await customer
      .findByIdAndUpdate(id, { preference: { $set: { allergies } } }, { new: true })
      .lean<Customer>()
      .exec();
    return cus;
  }

  async changePassword(customer_id: string, input: ChangePasswordDto, roles: string[]): Promise<Customer> {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
    const acc = await PasswordService.changePassword(customer_id, input);
    await NourishaBus.emit("customer:password:changed", { owner: acc });
    return acc;
  }

  async updateFCMToken(customer_id: string, input: { token: string; deviceId: string }, roles: string[]): Promise<FCMToken> {
    const device_token = await new NotificationService().updateFCMToken(customer_id, input, roles);
    await NourishaBus.emit("customer:device_token:updated", { owner: device_token.customer, token: device_token.token });
    return device_token;
  }

  // async deleteCustomer(sub: string, id: string, roles: string[]) {
  //   await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
  //     PermissionScope.DELETE,
  //     PermissionScope.ALL,
  //   ]);
  //   const data = await customer.findOneAndDelete({ _id: id }, { new: true }).lean<Customer>().exec();
  //   if (!data) throw createError(`Not found`, 404);
  //   await NourishaBus.emit("customer:deleted", { owner: data, modifier: sub });
  //   return data;
  // }

  async disableCustomer(sub: string, id: string, roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.DISABLE,
      PermissionScope.ALL,
    ]);
    const data = await customer
      .findOneAndUpdate({ _id: id }, { control: { suspended: true } }, { new: true })
      .lean<Customer>()
      .exec();
    if (!data) throw createError(`Customer not found`, 404);
    await NourishaBus.emit("customer:disabled", { owner: data, modifier: sub });

    return data;
  }

  async enableCustomer(sub: string, id: string, roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.ENABLE,
      PermissionScope.ALL,
    ]);
    const data = await customer
      .findOneAndUpdate({ _id: id }, { control: { suspended: false } }, { new: true })
      .lean<Customer>()
      .exec();
    if (!data) throw createError(`Customer not found`, 404);
    await NourishaBus.emit("customer:enabled", { owner: data, modifier: sub });

    return data;
  }

  async verifyEmail(input: VerifyEmailDto, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.VERIFY, PermissionScope.ALL]);

    if (!(await CustomerService.checkCustomerExists(input.customer_id))) throw createError("Customer not found", 404);

    const verification = await this.authVerificationService.getEmailVerification(
      input.customer_id,
      AuthVerificationReason.ACCOUNT_VERIFICATION,
      input.code,
      true
    );

    const _customer = await customer
      .findByIdAndUpdate(input.customer_id, { is_email_verified: true }, { new: true })
      .lean<Customer>()
      .exec();

    await this.authVerificationService.removeVerification(verification._id!);
    await NourishaBus.emit("customer:verified", { owner: _customer });
    return _customer;
  }

  async resetPassword(input: ResetPasswordDto) {
    if (!(await CustomerService.checkCustomerExists(input.customer_id))) throw createError("Customer not found", 404);

    const verification = await this.authVerificationService.getResetToken(
      input.customer_id,
      AuthVerificationReason.ACCOUNT_PASSWORD_RESET,
      input.token,
      true
    );

    const _customer = await PasswordService.addPassword(input.customer_id, input.password);
    await Promise.all([
      this.authVerificationService.removeVerification(verification._id!),
      NourishaBus.emit("customer:password:reset", { owner: _customer }),
    ]);
    return _customer;
  }

  async findByLogin(email: string, password: string, admin = false): Promise<Customer> {
    const where: any = { email };
    // if (!admin) Object.assign(where, { primary_role: "customer" });

    const acc = await customer.findOne(where).lean<Customer>().exec();
    if (!acc) throw createError("Customer not found", 404);

    if (!!acc?.control?.suspended) throw createError("Customer suspended, please contact the administrator", 404);

    const roles = (acc?.roles ?? [])?.map((role) => String(role));
    if (admin && !(await RoleService.isAdmin(roles))) throw createError("❌ Access Denied", 401);
    if (!(await PasswordService.checkPassword(acc._id!, password))) throw createError("Incorrect email or password", 401);
    await CustomerService.updateLastSeen(acc?._id!);
    return acc;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const count = await customer.countDocuments({ email }).exec();
    return count > 0;
  }

  static async checkCustomerExists(id: string): Promise<boolean> {
    const count = await customer.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  static async getCustomer(data: Customer | string): Promise<Customer | null> {
    if (typeof data === "object") return data;
    const cus = await customer.findById(data).lean<Customer>().exec().catch(console.log);
    if (!cus) return null;
    return cus;
  }

  static async updateLastSeen(customer_id: string, validate = false) {
    const acc = customer.findOneAndUpdate({ _id: customer_id }, { lastSeen: new Date() }, { new: true }).lean<Customer>().exec();
    if (!acc && validate) throw createError("Customer not found", 404);
    return;
  }

  static removeUpdateForcedInputs(input: UpdateCustomerDto) {
    return removeForcedInputs<Customer>(input as any, [
      "_id",
      "email",
      "createdAt",
      "updatedAt",
      "password",
      "is_email_verified",
      "control",
      "roles",
      "primary_role",
      "ref_code",
      "last_seen",
    ]);
  }

  async getAdmins(roles: string[], filters?: IPaginationFilter & { searchPhrase?: string }): Promise<PaginatedDocument<Customer>> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);
    const super_admin_role = await RoleService.getRoleBySlug(AvailableRole.SUPERADMIN);
    let queries: any = {};

    if (!!filters?.searchPhrase) Object.assign(queries, { $text: { $search: filters?.searchPhrase } });
    if (!!super_admin_role) Object.assign(queries, { roles: { $in: [super_admin_role._id] } });

    return await paginate("customer", queries, filters);
  }

  async updateNote(customer_id: string, dto: { notes: string }, roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    const cus = await customer
      .findByIdAndUpdate(customer_id, { ...dto }, { new: true })
      .lean<Customer>()
      .exec();
    if (!cus) throw createError("Customer not found", 404);
    return cus;
  }

  /***
   * This is a combined (simplified) version of the `assignRole` funciton from the `role.service` file
   * and the `updatePrimary` function from the `customer.service` file.
   */
  async makeAdmin(customer_id: string, roles: string[]): Promise<Customer> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.UPDATE,
      PermissionScope.ALL,
    ]);

    const res = await RoleService.getRoleBySlug("superadmin");
    const acc = (await customer
      .findOneAndUpdate({ _id: customer_id }, { primary_role: res.slug, $push: { roles: res?._id } }, { new: true })
      .lean()
      .exec()) as Customer;
    if (!acc) throw createError("Customer not found", 404);
    return acc;
  }

  /***
   * This is a combined (simplified) version of the `unassignRole` funciton from the `role.service` file
   * and the `updatePrimary` function from the `customer.service` file.
   */
  async revokeAdmin(customer_id: string, roles: string[]): Promise<Customer> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.UPDATE,
      PermissionScope.ALL,
    ]);

    const res = await RoleService.getRoleBySlug("superadmin");
    const acc = (await customer
      .findOneAndUpdate({ _id: customer_id }, { primary_role: "customer", $pull: { roles: res?._id } }, { new: true })
      .lean()
      .exec()) as Customer;
    if (!acc) throw createError("Customer not found", 404);
    return acc;
  }

  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new CustomerEventListener();
  }
}
