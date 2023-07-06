import Stripe from "stripe";
import config from "../../config";
import { RoleService } from "../role.service";
import { CreateSubscriptionDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { Customer, Subscription, customer, subscription } from "../../models";
import { createError, getUpdateOptions, paginate } from "../../utils";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { NourishaBus } from "../../libs";
import SubscriptionEventListener from "../../listeners/subscription.listener";

export class SubscriptionService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  static async createSubscription(stripe_customer_id: string, dto: CreateSubscriptionDto, dryRun = true) {
    const cus = await customer.findOne({ stripe_id: stripe_customer_id }).lean<Customer>().exec();
    if (!cus && dryRun) return;
    else if (!cus && !dryRun) throw createError("Customer does not exist", 404);

    // const already_exist = await this.checkSubscriptionExists(dto?.stripe_id);
    // if (already_exist && dryRun) return;
    // if (already_exist && !dryRun) throw createError("Subscription already exist", 404);

    const _sub = await subscription.findOneAndUpdate({ customer: cus?._id }, { ...dto, customer: cus?._id }, getUpdateOptions()).lean<Subscription>().exec();
    await customer.updateOne({_id: cus?._id}, {subscription: _sub?._id}).lean<Customer>().exec();

    await NourishaBus.emit('subscription:updated', {owner: cus, subscription: _sub});
    return _sub;
  }

  async getCurrentUsersSubscription(customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.SUBSCRIPTION, [PermissionScope.READ, PermissionScope.ALL]);
    const sub = await subscription.findOne({ customer: customer_id }).populate(["plan", "card"]).lean<Subscription>().exec();
    if (!sub) return null;
    return sub;
  }

  async cancelSubscription(customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.SUBSCRIPTION, [PermissionScope.CANCEL, PermissionScope.ALL]);
    const sub = await subscription.findOne({ customer: customer_id }).populate(["plan"]).lean<Subscription>().exec();
    if (!sub) throw createError("Subscription not found", 404);

    const stripe_sub = await this.stripe.subscriptions.del(sub?.stripe_id, {
      prorate: false, // TODO: confirm if the client would like to refund the unused subscription amount
    });
    if (!stripe_sub) throw createError(`Failed to cancel customer's subscription on stripe`, 400);
    const update = await subscription.updateOne({ _id: sub?._id }, { status: "cancelled" }).lean<Subscription>().exec();
    await NourishaBus.emit('subscription:cancelled', {owner: customer_id, subscription: sub});
    return update;
  }

  static async checkSubscriptionExists(id: string) {
    const count = await subscription.countDocuments({ stripe_id: id }).lean<number>().exec();
    return count > 0;
  }

  static async getSub(customer_id: string) {
    const sub = await subscription.findOne({ customer: customer_id }).populate(["plan", "card"]).lean<Subscription>().exec();
    if (!sub) return null;
    return sub;
  }

  // Admin

  async getSubscriptions(roles: string[], filters?: IPaginationFilter & {status: string}): Promise<PaginatedDocument<Subscription[]>> {
     await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
     
     let queries: {$and?: any[]} = {};
     const statuses = String(filters?.status ?? "").split(",");

     if(!!filters?.status) {
      queries = { ...queries, $and: [...(queries?.$and ?? [])] };
      queries.$and!.push({
        status: { $in: statuses },
      });
     }

    return paginate('subscription', queries, filters, {populate: ['customer', 'plan']});
  }


  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new SubscriptionEventListener();
  }
}
