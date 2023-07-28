import { IPaginationFilter, PaginatedDocument } from "../interfaces";
import { Customer, Referral, customer, referral } from "../models";
import {  getUpdateOptions, paginate } from "../utils";
import { RoleService } from "./role.service";
import { AvailableResource, PermissionScope } from "../valueObjects";
import { EarningsService } from "./earnings.service";


export class ReferralService {

    async createReferral(invitee_id: string, ref_code: string) {
        const cus = await customer.findOne({ref_code}).select('_id').lean<Customer>().exec();
        if(!cus) return null;
        const inviter_id = cus?._id;
        const ref = await referral.findOneAndUpdate({ref_code, invitee: invitee_id}, {inviter: inviter_id, invitee: invitee_id, ref_code, reward: 10, currency: 'gbp' }, getUpdateOptions()).lean<Referral>().exec();
        return ref;
    }

    async getCustomerPendingReferrals(customer_id: string, roles: string[], filters?: IPaginationFilter): Promise<PaginatedDocument<Referral[]>> {
        await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);
        let queries: any = {inviter: customer_id, is_subscribed: false};
        return await paginate('referral', queries, filters, {populate: ['invitee']});
    }

    async getCustomerCompletedReferrals(customer_id: string, roles: string[], filters?: IPaginationFilter): Promise<PaginatedDocument<Referral[]>> {
        await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);
        let queries: any = {inviter: customer_id, is_subscribed: true};
        return await paginate('referral', queries, filters, {populate: ['invitee']});
    }

    async getTotalReferredCustomers(customer_id: string, roles: string[]): Promise<{pending: number, completed: number, total: number}> {
        await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);
        
        const [pending, completed] = await Promise.all([
            referral.countDocuments({inviter: customer_id, is_subscribed: false}).lean<number>().exec(),
            referral.countDocuments({inviter: customer_id, is_subscribed: true}).lean<number>().exec(),
        ])
        return {
            pending,
            completed,
            total: pending + completed
        }
    }

    static async updateSubscribersInvite(subscriber_id: string, plan_id?: string) {
        console.log("Update Subscriber's Invite", {subscriber_id, plan_id});
        let ref = await referral.findOne({invitee: subscriber_id, is_subscribed: false}).lean<Referral>().exec()
        if(!ref) return;

        const session = await referral.startSession();

        console.log("\n\nSession Started...")
        try {
            const txs = await session.withTransaction(async () => {
                console.log("Session Executing...")

                EarningsService.updateEarnings(ref?.inviter, ref?.reward, subscriber_id, session),
                referral.findByIdAndUpdate(ref?._id, {is_subscribed: true}, {session}).lean<Referral>().exec()

                console.log("Session Executed...\n\n")
            })
            if(txs) await session.endSession();
        } catch (error) {
            await session.endSession();
            console.error("[UpdateSubscribersInvite]", error.message)
            // throw createError(error?.message, 400)
        }
    }

}