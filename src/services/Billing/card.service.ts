import Stripe from "stripe";
import { Card, card, customer, Customer } from "../../models";
import { CreateCardDto, IPaginationFilter } from "../../interfaces";
import { createError, getUpdateOptions, paginate } from "../../utils";
import { RoleService } from "../role.service";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import config from "../../config";

export class CardService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  static async createCard(stripe_customer_id: string, dto: CreateCardDto, dryRun = true) {
    const cus = await customer.findOne({ stripe_id: stripe_customer_id }).lean<Customer>().exec();
    if (!cus && dryRun) return;
    else if (!cus && !dryRun) throw createError("Customer does not exist", 404);

    // const already_exist = await this.checkPlanExists(dto?.fingerprint);
    // if (already_exist && dryRun) return;
    // if (already_exist && !dryRun) throw createError("Card already exist", 404);

    const _card = await card.findOneAndUpdate(
      { customer: cus?._id, fingerprint: dto?.fingerprint },
      { ...dto, customer: cus?._id, stripe_customer_id },
      getUpdateOptions()
    );
    return _card;
  }

  async getCardById(id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
    const _card = await card.findById(id).lean<Card>().exec();
    if (!_card) throw createError("Card does not exist", 404);
    return _card;
  }

  async getCurrentUserCards(id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
    return await paginate("card", { customer: id }, filters);
  }

  async deleteCard(id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
    const _card = await card.findById(id).lean<Card>().exec();
    if (!_card) throw createError("Card does not exist", 404);

    const method = await this.stripe.paymentMethods.detach(_card?.token);
    if (!method) throw createError("Failed to detach customer's payment_method on stripe", 401);

    return await card.deleteOne({ _id: id }).lean<Card>().exec();
  }

  static async detachCardHook(payment_method: string) {
    const _card = await card.findOneAndDelete({ token: payment_method }).lean<Card>().exec();
    if (!_card) return;
  }

  static async checkPlanExists(fingerprint: string): Promise<boolean> {
    const count = await card.countDocuments({ fingerprint }).exec();
    return count > 0;
  }
}
