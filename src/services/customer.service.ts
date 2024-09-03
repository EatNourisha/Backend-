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
import {
  customer,
  Customer,
  deletedCustomer,
  DeliveryDay,
  deliveryInfo,
  FCMToken,
  mealPack,
  order,
  Subscription,
  subscription,
  country,
  inactiveusers,
  cart,
} from "../models";
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
import { OrderStatus } from "../models/order";
import { add } from "date-fns";
import { MarketingService } from "./Marketing/marketing.service";
import mealLineup from "../models/mealLineup";
// import  registerAddKlaviyo  from '../klaviyo/addUser'
// import { when } from "../utils/when";

export class CustomerService {
  private authVerificationService = new AuthVerificationService();
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async getFeatureCounts(roles: string[]): Promise<{ meals: number; customers: number; subscriptions: number; orders: number }> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [PermissionScope.ALL]);

    const [meals, customers, subscriptions, orders] = await Promise.all([
      mealPack.countDocuments().lean<number>().exec(),
      customer.countDocuments({ primary_role: "customer" }).lean<number>().exec(),
      subscription.countDocuments({ status: "active" }).lean<number>().exec(),
      order.countDocuments({ status: OrderStatus.PAID }).lean<number>().exec(),
    ]);

    // console.log('Dashboard', {meals, customers, subscriptions})

    return { meals, customers, subscriptions, orders };
  }

  async addCountry(data) {
      const { name, code, weeklyPrice, monthlyPrice } = data;
      const newCountry = (await country.create({ name: name.toLowerCase(), code, weeklyPrice, monthlyPrice}));
      return newCountry;

  }

  async  updateCountry(id: string, data: any) {
    let existingCountry: any; 
  
    const { name, code, weeklyPrice, monthlyPrice } = data;
    try {
      existingCountry = await country.findOneAndUpdate(
        { _id: id, name: name.toLowerCase() },
        { $set: { code, weeklyPrice, monthlyPrice } },
        { new: true }
      );
    } catch (error) {
      console.error(`Failed to update country ${name}: ${error.message}`);
      // Handle any error that might occur during the update
    }
    return existingCountry;
  }
    
  async getCountries() {
    const countries = await country.find().lean().exec();
    return countries;
  }

  async getCountriesById(_id: string) {
    const result = await country.findById(_id);
    return result;
  }


  async createCustomer(input: CustomerDto, roles?: string[]): Promise<Customer> {
   const em = await this.validateEmail(input?.email) 
    if(!em) throw createError("email must have an @ symbol", 404);
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
 

  async toggleAutoRenewal(customer_id: string, dto: { auto_renew: boolean }, roles: string[]) {
    validateFields(dto, ["auto_renew"]);
    await RoleService.requiresPermission([AvailableRole.CUSTOMER], roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE]);

    const cus = await customer
      .findByIdAndUpdate(customer_id, { preference: { auto_renew: dto?.auto_renew } }, { new: true })
      .populate("subscription")
      .lean<Customer>()
      .exec();

    if (!cus) throw createError("Customer does not exist", 404);
    const sub = cus?.subscription as Subscription;

    // https://stripe.com/docs/billing/subscriptions/pause
    // NOTE: This method of pausing stops invoices from been charged, and offers services for free.
    // It causes draft invoices payments to be skipped and user subscriptions will be automatically active.
    // const param = when<any>(!!dto?.auto_renew, "", { behavior: "void" });
    // if (!!sub?.stripe_id && sub?.stripe_id?.length > 2 && sub?.status === "active")
    //   await this.stripe.subscriptions.update(sub?.stripe_id, { pause_collection: param });

    if (!!sub?.stripe_id && sub?.stripe_id?.length > 2 && sub?.status === "active")
      await this.stripe.subscriptions.update(sub?.stripe_id!, {
        cancel_at_period_end: !dto?.auto_renew,
      });

    return cus;
  }

  async setDeliveryDay(customer_id: string, dto: SetDeliveryDayDto, roles: string[]): Promise<Customer> {
    validateFields(dto, ["delivery_day", "delivery_date"]);

    const supported_days = Object.values(DeliveryDay);
    if (!supported_days.includes(dto.delivery_day)) throw createError(`Available delivery days are ${supported_days.join(", ")}`, 400);

    await RoleService.requiresPermission([AvailableRole.CUSTOMER], roles, AvailableResource.CUSTOMER, [PermissionScope.READ]);

    const [_customer] = await Promise.all([
      customer
        .findByIdAndUpdate(customer_id, { ...dto }, { new: true })
        .lean<Customer>()
        .exec(),
      DeliveryService.updateDeliveryDayOfWeek(customer_id, dto?.delivery_day, dto?.delivery_date),
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
      populate: [
        { path: "subscription", populate: ["plan"] },
        { path: "preference.allergies" },
        { path: "roles" },
        { path: "delivery_info" },
      ],
      // sort: { subscription_status: -1 },
    });
  }

  async getCustomerById(customer_id: string, roles: string[]): Promise<Customer> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);
    const cus = await customer
      .findById(customer_id)
      .populate([{ path: "subscription", populate: ["plan"] }, { path: "preference.allergies" }, "lineup", "delivery_info"])
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
      new DeliveryService().getDeliveryInfo(id, roles, true),
    ];
    const [_, __, isAdminResult] = await Promise.allSettled(toRun);

    console.log("Is Admin", isAdminResult);

    let data = await customer.findById(id).lean<Customer>().exec();
    if (!data) throw createError(`Not found`, 404);

    if (!data?.stripe_id) {
      data = await this.attachStripeId(data?._id!, data?.email, join([data?.first_name, data?.last_name], " "));
    }
    // if (!data?.delivery_info) {
    //   const c = await this.attachDeliveryInfo(data?._id!);
    //   if (!!c) data = c;
    // }

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

    const acc = await customer
      .findByIdAndUpdate(id, { stripe_id: cons.id, last_stripe_check: new Date() }, { new: true })
      .lean<Customer>()
      .exec();
    return acc;
  }

  async attachDeliveryInfo(id: string) {
    const info = await deliveryInfo.findOne({ customer: id }).select("_id").lean().exec();
    if (!info) return null;

    const acc = await customer
      .findByIdAndUpdate(id, { delivery_info: info?._id }, { new: true })
      // .populate("delivery_info")
      .lean<Customer>()
      .exec();
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
    
    if (!!input?.address) validateFields(input?.address, ["address_", "city", "postcode", "country"]);
    const address = input?.address
    const add =  await this.validateAddress(address?.address_)
    const ci =  await this.validateAddress(address?.city)
    const post =  await this.validateAddress(address?.postcode)
    const coun =  await this.validateAddress(address?.country)

  if(!add || !ci || !post || !coun ) throw createError("Don't add these symbols: @$€£¥#~", 404);

    const data = await customer
      .findOneAndUpdate({ _id: id }, { ...input }, { new: true })
      .lean()
      .exec();
    if (!data) throw createError(`Customer not found`, 404);
    if (!!input?.address && !!data?.email) await MarketingService.updateContactAddr(data?.email, input?.address);
    return data;
  }

 async validateAddress(address) {
    const addressRegex = /^[a-zA-Z0-9\s,.'-]+(?<![@$€£¥#~])$/;
    return addressRegex.test(address);
}

async validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
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
    await this.ascertainCustomerStripeId(acc);
    await CustomerService.updateLastSeen(acc?._id!);
    console.log("Account" + acc);
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

   async updateUserLineup(email: string): Promise<string> {
    try {
      const user = await customer.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.lineup) {
        throw new Error("User lineup not found");
      }

     const updatedResult = await customer.updateOne({ email }, { $unset: { lineup: 1 } });
      
      if (updatedResult.matchedCount === 1) {

        return "User lineup updated successfully";
      } else {
        throw new Error("User lineup update failed");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
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

  async ascertainCustomerStripeId(cus: Customer) {
    // this will check every month to seen if this customer still exists on stripe else we add the customer to stripe
    // this is also to make sure that the stripe_id on the customer data exists on stripe as it is required to make payments and subscriptions
    if (!!cus?.last_stripe_check && Date.now() < add(cus?.last_stripe_check, { months: 1 }).getTime()) return;

    const stripe_cus = await this.stripe.customers
      .retrieve(cus?.stripe_id)
      .catch((err) => console.log(`[ascertainCustomerStripeId]`, err.message));

    // console.log("Customer", stripe_cus);
    if (!stripe_cus) await this.attachStripeId(cus?._id!, cus?.email, join([cus?.first_name, cus?.last_name], " "));
  }

  static async getCustomersByEmailAndFirstNameUnrestricted(
    filters?: {
      email?: string;
      firstName?: string;
    }
  ): Promise<Customer[]> {
    let queries: any = {};
  
    // Add email filter if provided
    if (!!filters?.email) Object.assign(queries, { email: filters.email });
  
    // Add first name filter if provided
    if (!!filters?.firstName) Object.assign(queries, { firstName: filters.firstName });
  
    // Use the find method to retrieve customers without pagination or permission checks
    const customers = await customer.find(queries).exec();
  
    return customers;
  }


  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new CustomerEventListener();
  }

  
//  static  async findInactiveCustomers() {
//       const sixMonthsAgo = subMonths(new Date(2023, 11, 1), 10); 
//       const fromDate = new Date(2023, 11, 1); 
//     const today = new Date();

//   const monthsAgo = differenceInMonths(today, fromDate);
//   console.log('month', monthsAgo)
  
//       const allCustomers = await customer.find({
//           createdAt: { $lte: new Date() }
//       }).lean().exec();
  
//       const inactiveCustomers: InactiveCustomer[] = [];
      
//       for (const customer of allCustomers) {

//     const customerIdStr = customer._id.toString();
//     const cartExists = await cart.exists({ customer: customer._id });
//     const lineupExists = await mealLineup.exists({ customer: customer._id });
//     const alreadyExists = await inactiveusers.exists({ customer: customerIdStr });

//         if (!cartExists && !lineupExists && !alreadyExists) {
//             inactiveCustomers.push({
//               customer: customer._id,
//               email: customer.email,
//               firstname: customer.first_name,
//               lastname: customer.last_name,
//               // address: ` ${customer?.address.city}`,
//               phoneNumber: customer?.phone,
//               ref_code: customer?.ref_code,
//               reg_date: customer.createdAt ?? sixMonthsAgo ,
//             });
//         }
//       }
  
//       if (inactiveCustomers.length > 0) {
//           await inactiveusers.insertMany(inactiveCustomers);
//       }
  
//       return inactiveCustomers;
//   }
  
static async findInactiveCustomers() {

  const allCustomers = await customer.find({
    createdAt: { 
      $gte: new Date(2023, 11, 1),  
      $lte: new Date()   
      }
  }).lean().exec();

  for (const customer of allCustomers) {
    const customerIdStr = customer._id.toString();
    const cartExists = await cart.exists({ customer: customer._id });
    const lineupExists = await mealLineup.exists({ customer: customer._id });

    if (!cartExists && !lineupExists) {
      await inactiveusers.findOneAndUpdate(
        { customer: customerIdStr },
        {
          $setOnInsert: {
            customer: customerIdStr,
            email: customer.email,
            firstname: customer.first_name,
            lastname: customer.last_name,
            phoneNumber: customer?.phone,
            ref_code: customer?.ref_code,
            stripe_cus_id: customer?.stripe_id,
            address: customer?.address,
            registration_date: customer.createdAt,
            last_seen: customer.last_seen ,
            last_stripe_check: customer.last_stripe_check ,
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  return inactiveusers.find({}).lean().exec(); // Return the list of inactive users if needed
}


}
