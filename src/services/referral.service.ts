import { IPaginationFilter, PaginatedDocument } from "../interfaces";
import { Customer, Referral, customer, referral, withdrawalRequest } from "../models";
import { getUpdateOptions, paginate } from "../utils";
import { RoleService } from "./role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../valueObjects";
import { EarningsService } from "./earnings.service";
import { DiscountService } from "./Billing/discount.service";

export class ReferralService {
  async createReferral(invitee_id: string, ref_code: string) {
    const refCode = String(ref_code).toLowerCase();
    const cus = await customer.findOne({ ref_code: refCode }).select("_id").lean<Customer>().exec();
    if (!cus) return await DiscountService.attachPromoToCustomer(invitee_id, ref_code);

    const inviter_id = cus?._id;
    const ref = await referral
      .findOneAndUpdate(
        { ref_code, invitee: invitee_id },
        { inviter: inviter_id, invitee: invitee_id, ref_code, reward: 10, currency: "gbp" },
        getUpdateOptions()
      )
      .lean<Referral>()
      .exec();
    return ref;
  }

  async getCustomerPendingReferrals(
    customer_id: string,
    roles: string[],
    filters?: IPaginationFilter & { ref_code: string }
  ): Promise<PaginatedDocument<Referral[]>> {
    await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);
    let queries: any = { inviter: customer_id, is_subscribed: false };

    return await paginate("referral", queries, filters, { populate: ["invitee"] });
  }

  async getCustomerCompletedReferrals(
    customer_id: string,
    roles: string[],
    filters?: IPaginationFilter
  ): Promise<PaginatedDocument<Referral[]>> {
    await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);
    let queries: any = { inviter: customer_id, is_subscribed: true };
    return await paginate("referral", queries, filters, { populate: ["invitee"] });
  }

  async getTotalReferredCustomers(customer_id: string, roles: string[]): Promise<{ pending: number; completed: number; total: number }> {
    await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);

    const [pending, completed] = await Promise.all([
      referral.countDocuments({ inviter: customer_id, is_subscribed: false }).lean<number>().exec(),
      referral.countDocuments({ inviter: customer_id, is_subscribed: true }).lean<number>().exec(),
    ]);
    return {
      pending,
      completed,
      total: pending + completed,
    };
  }

  static async updateSubscribersInvite(subscriber_id: string, plan_id?: string) {
    console.log("Update Subscriber's Invite", { subscriber_id, plan_id });
    let ref = await referral.findOne({ invitee: subscriber_id, is_subscribed: false }).lean<Referral>().exec();
    if (!ref) return;

    const session = await referral.startSession();

    console.log("\n\nSession Started...");
    try {
      const txs = await session.withTransaction(async () => {
        console.log("Session Executing...");

        // await Promise.all([
        EarningsService.updateEarnings(ref?.inviter, 10 ?? ref?.reward, ref?._id!, session);
        referral.findByIdAndUpdate(ref?._id, { is_subscribed: true, subscription_plan: plan_id }, { session }).lean<Referral>().exec();
        // ]);

        console.log("Session Executed...\n\n");
      });
      if (txs) await session.endSession();
    } catch (error) {
      await session.endSession();
      console.error("[UpdateSubscribersInvite]", error.message);
      // throw createError(error?.message, 400)
    }
  }

  // Admin

  async getReferralStats(roles: string[], filter?: { customer: string }) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.REFERRAL, [PermissionScope.ALL]);

    let where: any = { is_subscribed: false };
    if (!!filter?.customer) Object.assign(where, { inviter: filter.customer });

    const [unsubscribed_invites, subscribed_invites, pending_withdrawals, fulfilled_withdrawals] = await Promise.all([
      referral.countDocuments(where).lean<number>().exec(),
      referral
        .countDocuments({ ...where, is_subscribed: true })
        .lean<number>()
        .exec(),
      withdrawalRequest.countDocuments({ ...where, is_fulfilled: false }),
      withdrawalRequest.countDocuments({ ...where, is_fulfilled: true }),
    ]);

    return { unsubscribed_invites, subscribed_invites, pending_withdrawals, fulfilled_withdrawals };
  }

  async getAllInvitedCustomers(
    roles: string[],
    filters: IPaginationFilter & { customer: string; ref_code: string }
  ): Promise<PaginatedDocument<Referral[]>> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.REFERRAL, [PermissionScope.ALL]);

    let where: any = {};
    if (!!filters?.customer) Object.assign(where, { inviter: filters.customer });
    if (!!filters?.ref_code) Object.assign(where, { ref_code: { $regex: `^${filters?.ref_code}$`, $options: "i" } });

    // console.log("Query", { where, filters });
    return await paginate("referral", where, filters, { populate: ["inviter", "invitee", "promo"] });
  }

  async getAllSubscribedInvitedCustomers(
    roles: string[],
    filters: IPaginationFilter & { customer: string; ref_code: string }
  ): Promise<PaginatedDocument<Referral[]>> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.REFERRAL, [PermissionScope.ALL]);

    let where: any = { is_subscribed: true };
    if (!!filters?.customer) Object.assign(where, { inviter: filters.customer });
    if (!!filters?.ref_code) Object.assign(where, { ref_code: { $regex: `^${filters?.ref_code}$`, $options: "i" } });
    return await paginate("referral", where, filters, { populate: ["inviter", "invitee", "subscription_plan", "promo"] });
  }
}
