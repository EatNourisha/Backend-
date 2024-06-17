import Stripe from "stripe";
import { GiftCardDto, GiftPurchaseDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { Customer, GiftCard, GiftPurchase, customer, giftcard, giftpurchase, transaction } from "../../models";
import { RoleService } from "../role.service";
import { createError, paginate, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import config from "../../config";
import { TransactionReason } from "../../models/transaction";
export class GiftCardService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
  async createGiftCard(dto: GiftCardDto, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.GIFTCARD, [PermissionScope.CREATE, PermissionScope.ALL]);
    const result = await this.stripe.products.create({
      name: dto.name,
      default_price_data: {
        currency: "gbp",
        unit_amount: dto.amount * 100,
        recurring: {
          interval: dto.subscription_interval,
          interval_count: 1,
        },
      },
    });

    const _giftcard = await giftcard.create({ ...dto, product_id: result.id, price_id: result.default_price });
    return _giftcard;
  }

  async buyGiftCard(customer_id: string, dto: GiftPurchaseDto, roles: string[]) {
    validateFields(dto, ["gift_id"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const cus = await customer.findById(customer_id).populate("pending_promo").lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const _giftcard = await giftcard.findById(dto?.gift_id).lean<GiftCard>().exec();
    if (!_giftcard) throw createError("gift card does not exist", 404);

    const cupondCode = await this.generateCoupon(7);

    const intent = await this.stripe.paymentIntents.create({
      customer: cus?.stripe_id,
      amount: Math.round(_giftcard?.amount * 100),
      currency: "gbp",
      receipt_email: cus?.email,
      expand: ["invoice"],
    });

    if (!!intent.id) {
      await transaction.create({
        itemRefPath: "Gift-Card",
        item: _giftcard?._id,
        currency: intent.currency,
        order_reference: intent?.id,
        customer: cus?._id,
        amount: (intent.amount ?? 0) / 100,
        reference: intent?.id,
        reason: TransactionReason.GIFTCARD,
        stripe_customer_id: cus?.stripe_id,
      });
    }

    await Promise.all([
      giftpurchase.create({
        gift_id: dto?.gift_id,
        code: cupondCode,
        customer: customer_id,
        reciever_email: dto?.reciever_email,
        gift_message: dto?.gift_message,
        amount: (intent?.amount ?? 0) / 100,
        reference: intent?.id
      }),
    ]);
    return { client_secret: intent?.client_secret };
  }

  async generateCoupon(length: number): Promise<string> {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async deleteGiftCard(id: string, roles: string[]): Promise<GiftCard> {
    await RoleService.hasPermission(roles, AvailableResource.GIFTCARD, [PermissionScope.DELETE, PermissionScope.ALL]);

    const _giftcard = await giftcard.findByIdAndDelete(id).lean<GiftCard>().exec();
    if (!_giftcard) throw createError("Gift card does not exist", 400);
    return _giftcard;
  }

  async getGiftCards(_: string[], filters?: IPaginationFilter): Promise<PaginatedDocument<GiftCard[]>> {
    let queries: any = {};
    return await paginate("giftcard", queries, filters);
  }

  async getCustomerGiftPurchase(
    customer_id: string,
    filters?: IPaginationFilter & { status?: string }
  ): Promise<PaginatedDocument<GiftPurchase[]>> {

    return await paginate("giftpurchase", { customer: { $in: customer_id } }, filters);
  }
}
