import Stripe from "stripe";
import { GiftCardDto, GiftPurchaseDto, IPaginationFilter, PaginatedDocument, CustomGiftDto } from "../../interfaces";
import {  CustomGift, Customer, GiftCard, GiftPurchase, customer, customgift, giftcard, giftpurchase, transaction } from "../../models";
import { RoleService } from "../role.service";
import { createError, paginate, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import config from "../../config";
import { TransactionReason } from "../../models/transaction";
import { NourishaBus } from "../../libs";
// import { SubscriptionInterval } from "../../models/customgift";
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

  // async buyGiftCard(customer_id: string, dto: GiftPurchaseDto, roles: string[]) {
  //   validateFields(dto, ["gift_id"]);
  //   await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

  //   const cus = await customer.findById(customer_id).populate("pending_promo").lean<Customer>().exec();
  //   if (!cus) throw createError("Customer does not exist", 404);

  //   const _giftcard = await giftcard.findById(dto?.gift_id).lean<GiftCard>().exec();
  //   if (!_giftcard) throw createError("gift card does not exist", 404);

  //   const cupondCode = await this.generateCoupon(7);

  //   const intent = await this.stripe.paymentIntents.create({
  //     customer: cus?.stripe_id,
  //     amount: Math.round(_giftcard?.amount * 100),
  //     currency: "gbp",
  //     receipt_email: cus?.email,
  //     expand: ["invoice"],
  //   });

  //   if (!!intent.id) {
  //     await transaction.create({
  //       itemRefPath: "Gift-Card",
  //       item: _giftcard?._id,
  //       currency: intent.currency,
  //       order_reference: intent?.id,
  //       customer: cus?._id,
  //       amount: (intent.amount ?? 0) / 100,
  //       reference: intent?.id,
  //       reason: TransactionReason.GIFTCARD,
  //       stripe_customer_id: cus?.stripe_id,
  //     });
  //   }

  //   await Promise.all([
  //     giftpurchase.create({
  //       gift_id: dto?.gift_id,
  //       code: cupondCode,
  //       customer: customer_id,
  //       reciever_email: dto?.reciever_email,
  //       gift_message: dto?.gift_message,
  //       amount: (intent?.amount ?? 0) / 100,
  //       reference: intent?.id
  //     }),
  //   ]);
  //   return { client_secret: intent?.client_secret };
  // }


  async buyGiftCard(customer_id: string, dto: GiftPurchaseDto, roles: string[]) {
    validateFields(dto, ["gift_id"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
  
    const cus = await customer.findById(customer_id).populate("pending_promo").lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);
    
    const couponCode = await this.generateCoupon(7);
    let giftItem = await giftcard.findById(dto?.gift_id).lean<GiftCard>().exec();
    
    let customItem = await customgift.findById(dto?.gift_id).lean<CustomGift>().exec();
    if (!giftItem) {
      if (!customItem) throw createError("Gift card or custom gift does not exist", 404);
    }
    let amountToPay = 0 
    const amount = Math.round(giftItem?.amount * 100);
    // if(amount){
    //   amountToPay += amount
    // }
    if(!amount || amount < 1){
      const cusAmount = customItem?.amount
      amountToPay += cusAmount
    }

    if(dto?.scheduled === true && !dto?.scheduled_date){
      validateFields(dto, ["scheduled_date"]);
    }

    const intent = await this.stripe.paymentIntents.create({
      customer: cus?.stripe_id,
      amount: amount || Math.round(amountToPay * 100),
      currency: "gbp",
      receipt_email: cus?.email,
      expand: ["invoice"],
    });
  
    if (!!intent.id) {
      await transaction.create({
        itemRefPath: "Gift-Card",
        item: giftItem?._id,
        currency: intent.currency,
        order_reference: intent?.id,
        customer: cus?._id,
        amount: (intent.amount ?? 0) / 100,
        reference: intent?.id,
        reason: TransactionReason.GIFTCARD,
        stripe_customer_id: cus?.stripe_id,
      });
    }
  
    
    const giftPur = await giftpurchase.create({
        gift_id: dto?.gift_id,
        code: couponCode,
        customer: customer_id,
        reciever_email: dto?.reciever_email,
        reciever_name: dto?.reciever_name,
        gift_message: dto?.gift_message,
        amount: (intent?.amount ?? 0) / 100,
        reference: intent?.id,
        scheduled: dto?.scheduled,
        scheduled_date: dto?.scheduled_date
      })

    const payload = {
      email: giftPur?.reciever_email!,
      gifter: `${cus?.first_name!} ${cus?.last_name!}`,
      name: giftPur?.reciever_name!, 
      coupon: giftPur?.code!,
      amount: giftPur?.amount!,
      message: giftPur?.gift_message!,
    };

   await NourishaBus.emit("customer:send_giftcard_email", payload);

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

  async createCustomGift(customer_id: string, dto: CustomGiftDto, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMGIFT, [PermissionScope.CREATE, PermissionScope.ALL]);
    
    // const result = await this.stripe.products.create({
    //   name: dto.name,
    //   default_price_data: {
    //     currency: "gbp",
    //     unit_amount: dto.amount * 100,
    //     recurring: {
    //       interval: dto.subscription_interval,
    //       interval_count: 1,
    //     },
    //   },
    // });

    const _giftcard = await customgift.create({
      ...dto,
      customer: customer_id,
    });
  
    return _giftcard;
  }

  async getCustomerCustomGift(
    customer_id: string,
    filters?: IPaginationFilter & { status?: string }
  ): Promise<PaginatedDocument<CustomGift[]>> {

    return await paginate("customgift", { customer: { $in: customer_id } }, filters);
  }

  async deleteCustomGift(id: string, roles: string[]): Promise<CustomGift> {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMGIFT, [PermissionScope.DELETE]);

    const _giftcard = await customgift.findByIdAndDelete(id).lean<CustomGift>().exec();
    if (!_giftcard) throw createError("Custom Gift does not exist", 400);
    return _giftcard;
  }



  // async giftCardRecieverEmail(customer_id: string, dto: GiftPurchaseDto, send_email = true,) {

  //   const acc = await customer.findById(customer_id).lean<Customer>().exec();
  //   if (!acc) throw createError("Customer not found", 404);

  //   const _gift = await giftpurchase.findOne({gift_id: dto?.gift_id})
  //   if (send_email)
  //     await NourishaBus.emit("customer:send_giftcard_email", {
  //           // email:'shukazuby@gmail.com'!,
  //           // gifter: 'Zuzu'!,
  //           // name: 'Zubaidat'!, 
  //           // coupon: 'Code233'!,
  //           // amount: 100!,
  //           email: dto?.reciever_email!,
  //           gifter: acc?.first_name!,
  //           name: dto?.reciever_name!, 
  //           coupon: _gift?.code!,
  //           amount: _gift?.amount!,
  //         });

  //     console.log(send_email);
  //     console.log("Gift Card Sent ", );
  //     return _gift ;
  // }

}
