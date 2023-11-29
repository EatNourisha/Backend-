import Stripe from "stripe";
import config from "../../config";
import { RoleService } from "../role.service";
import { CreateSubscriptionDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { Card, Customer, Plan, Subscription, card, customer, plan, subscription, transaction } from "../../models";
import { createError, epochToCurrentTime, getUpdateOptions, paginate } from "../../utils";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { NourishaBus } from "../../libs";
import SubscriptionEventListener from "../../listeners/subscription.listener";
import { ReferralService } from "../../services/referral.service";

export class SubscriptionService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  static async createSubscription(stripe_customer_id: string, dto: CreateSubscriptionDto, dryRun = true) {
    const cus = await customer.findOne({ stripe_id: stripe_customer_id }).lean<Customer>().exec();
    if (!cus && dryRun) return;
    else if (!cus && !dryRun) throw createError("Customer does not exist", 404);

    // const already_exist = await this.checkSubscriptionExists(dto?.stripe_id);
    // if (already_exist && dryRun) return;
    // if (already_exist && !dryRun) throw createError("Subscription already exist", 404);

    const _sub = await subscription
      .findOneAndUpdate({ customer: cus?._id }, { ...dto, customer: cus?._id }, getUpdateOptions())
      .populate(["plan", "card"])
      .lean<Subscription>()
      .exec();
    await customer.updateOne({ _id: cus?._id }, { subscription: _sub?._id, subscription_status: _sub?.status }).lean<Customer>().exec();

    if (!!_sub && !!cus?._id) await ReferralService.updateSubscribersInvite(cus?._id, (_sub?.plan as any)?._id!);
    if (!dryRun) await NourishaBus.emit("subscription:updated", { owner: cus, subscription: _sub });
    return _sub;
  }

  async getCurrentUsersSubscription(customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.SUBSCRIPTION, [PermissionScope.READ, PermissionScope.ALL]);
    let sub = await subscription.findOne({ customer: customer_id }).populate(["plan", "card"]).lean<Subscription>().exec();
    if (!sub || ["incomplete_expired", "cancelled", "canceled"].includes(sub?.status)) {
      ((await new SubscriptionService().reconcileSubscription(customer_id)) as Subscription) ?? null;
      // const reconcilled_sub = ((await new SubscriptionService().reconcileSubscription(customer_id)) as Subscription) ?? null;
      // if (!reconcilled_sub) throw createError("Subscription not found!", 404);
    }
    return sub;
  }

  async cancelSubscription(customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.SUBSCRIPTION, [PermissionScope.CANCEL, PermissionScope.ALL]);
    const sub = await subscription.findOne({ customer: customer_id }).populate(["plan"]).lean<Subscription>().exec();
    if (!sub) throw createError("Subscription not found", 404);

    const stripe_sub = await this.stripe.subscriptions.del(sub?.stripe_id!, {
      prorate: false, // TODO: confirm if the client would like to refund the unused subscription amount,
    });
    if (!stripe_sub) throw createError(`Failed to cancel customer's subscription on stripe`, 400);
    const update = await subscription.updateOne({ _id: sub?._id }, { status: "cancelled" }).lean<Subscription>().exec();
    await NourishaBus.emit("subscription:cancelled", { owner: customer_id, subscription: sub });
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

  async getSubscriptions(
    roles: string[],
    filters?: IPaginationFilter & { status: string; plan: string }
  ): Promise<PaginatedDocument<Subscription[]>> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    let queries: { $and?: any[] } = {};
    const statuses = String(filters?.status ?? "").split(",");
    const plans = String(filters?.plan ?? "").split(",");

    if (!!filters?.status) {
      queries = { ...queries, $and: [...(queries?.$and ?? [])] };
      queries.$and!.push({
        status: { $in: statuses },
      });
    }

    if (!!filters?.plan) {
      queries = { ...queries, $and: [...(queries?.$and ?? [])] };
      queries.$and!.push({
        plan: { $in: plans },
      });
    }

    // const aggregate =  await subscription.aggregate([
    //   // {$unwind: {path: '$plan'}},
    //   // {$lookup: {from: 'plan', as: 'plan', localField: 'plan', foreignField: '_id'}},
    //   // {$lookup: {
    //   //   from:"plan",
    //   //   localField: "plan",
    //   //   // foreignField: "_id",
    //   //   as: "plan"

    //   // }},
    //   {$match: {
    //     "plan.slug": "individual"
    //   }}
    // ]).exec();

    // console.log("Subscription Aggregate", aggregate)

    return paginate("subscription", queries, filters, { populate: ["customer", "plan"] });
  }

  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new SubscriptionEventListener();
  }

  async reconcileSubscription(customer_id: string) {
    const cus_db = await customer.findById(customer_id).select("stripe_id").lean<Customer>().exec();
    if (!cus_db) return null;
    const cus = (await this.stripe.customers.retrieve(cus_db?.stripe_id, { expand: ["subscriptions"] })) as Stripe.Customer;

    const data = cus.subscriptions?.data[0] as any;
    // console.log("Reconciled Subscription", cus?.subscriptions?.data);
    if (!data || data?.status !== "active") return null;

    const [_plan, _card] = await Promise.all([
      plan.findOne({ product_id: data?.plan?.product }).select("_id").lean<Plan>().exec(),
      card.findOne({ token: data?.default_payment_method }).select("_id").lean<Card>().exec(),
    ]);

    const sub = await SubscriptionService.createSubscription(data?.customer! as string, {
      stripe_id: data?.id!,
      start_date: epochToCurrentTime(data?.current_period_start!),
      end_date: epochToCurrentTime(data?.current_period_end!),
      status: data?.status!,
      plan: _plan?._id!,
      card: _card?._id!,
      next_billing_date: epochToCurrentTime(data?.current_period_end!), //TODO: (WIP) confirm if the next billing date is valid
    });

    await transaction
      .updateOne({ subscription_reference: data?.id, stripe_customer_id: data?.customer }, { item: sub?._id, plan: _plan?._id })
      .exec();

    return sub;
  }

  static async updateSubscription(id: string, dto: Partial<CreateSubscriptionDto>) {
    const sub = await subscription
      .findByIdAndUpdate(id, { ...dto }, { new: true })
      .lean<Subscription>()
      .exec();
    if (!sub) return;

    await customer.updateOne({ _id: sub?.customer }, { subscription_status: dto?.status }).exec();
    return sub;
  }
}
