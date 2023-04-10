import Stripe from "stripe";
import config from "../../config";
import { RoleService } from "../role.service";
import { CreateSubscriptionDto } from "../../interfaces";
import { Customer, Subscription, customer, subscription } from "../../models";
import { createError, getUpdateOptions } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";

export class SubscriptionService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  static async createSubscription(stripe_customer_id: string, dto: CreateSubscriptionDto, dryRun = true) {
    const cus = await customer.findOne({ stripe_id: stripe_customer_id }).lean<Customer>().exec();
    if (!cus && dryRun) return;
    else if (!cus && !dryRun) throw createError("Customer does not exist", 404);

    // const already_exist = await this.checkSubscriptionExists(dto?.stripe_id);
    // if (already_exist && dryRun) return;
    // if (already_exist && !dryRun) throw createError("Subscription already exist", 404);

    const _sub = await subscription.findOneAndUpdate({ customer: cus?._id }, { ...dto, customer: cus?._id }, getUpdateOptions());
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
    return await subscription.updateOne({ _id: sub?._id }, { status: "cancelled" }).lean<Subscription>().exec();
  }

  static async checkSubscriptionExists(id: string) {
    const count = await subscription.countDocuments({ stripe_id: id }).lean<number>().exec();
    return count > 0;
  }
}
