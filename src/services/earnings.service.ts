import { earnings, Earnings, withdrawalRequest, WithdrawalRequest } from "../models";
import { createError, getUpdateOptions, validateFields } from "../utils";
import { RoleService } from "./role.service";
import { AvailableResource, PermissionScope } from "../valueObjects";
import { WithdrawalRequestDto } from "interfaces";
import { ClientSession } from "mongoose";


export class EarningsService {

    async getCustomerEarnings(customer_id: string, roles: string[]): Promise<Earnings> {
        await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);
        return await EarningsService.getEarnings(customer_id);
    }

    async requestWithdrawal(customer_id: string, dto: WithdrawalRequestDto, roles: string[]): Promise<WithdrawalRequest | null> {
        validateFields(dto, ['amount', 'account_info']);
        if(!!dto?.account_info) validateFields(dto.account_info, ['bank_name', 'bank_number']);

        const minimum_withdraw_amount = 100;
        await RoleService.hasPermission(roles, AvailableResource.REFERRAL, [PermissionScope.READ, PermissionScope.ALL]);

        const earn = await EarningsService.getEarnings(customer_id);
        const last_request = await withdrawalRequest.findOne({customer: customer_id, is_fulfilled: false}).select('_id').lean<WithdrawalRequest>().exec();
        if(dto.amount > earn.balance || dto.amount <= 0) throw createError('Insufficient balance', 403);
        if(earn.balance < minimum_withdraw_amount) throw createError(`The minimum withdraw amount is ${minimum_withdraw_amount}`, 403);
        if(!!last_request) throw createError("Your last withdrawal request has not been fulfilled", 401);

        let result: any | null = null;
        const session = await withdrawalRequest.startSession();

        try {
            const txs = await session.withTransaction(async () => {
                result = await withdrawalRequest.create({...dto, customer: customer_id, is_fulfilled: false, refs: earn?.refs}, {session})
                await earnings.findByIdAndUpdate(earn._id, {$inc: {balance: -dto?.amount}}, {session}).lean().exec();

                console.log("Request Withdraw REsult", result);
            });
            if (txs) await session.endSession();
        } catch (error) {
            await session.endSession();
            throw createError(error.message, 400);
        }

        return result;
    }


    static async updateEarnings(customer_id: string, value: number, invitee_id: string, session?: ClientSession): Promise<Earnings> {
        await this.getEarnings(customer_id); // Ensures the customer's earnings document
        return (await earnings
        .findOneAndUpdate({ customer: customer_id}, { $inc: { balance: value }, $push: {refs: invitee_id} }, { session })
        .lean<Earnings>()
        .exec()) as Earnings;
    }


    static async getEarnings(customer_id: string): Promise<Earnings> {
        return await earnings.findOneAndUpdate({customer: customer_id}, {customer: customer_id}, getUpdateOptions()).lean<Earnings>().exec();
    }

}