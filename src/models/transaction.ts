// @ts-nocheck

import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { Subscription } from "./subscription";
import { Plan } from "./plan";
import { PromoCode } from "./promocode";

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  DECLINED = "declined",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

export enum TransactionReason {
  SUBSCRIPTION = "subscription",
  ORDER = "order",
}

export enum ItemModelTypes {
  SUBSCRIPTION = "Subscription",
  ORDER = "Order",
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Transaction extends BaseEntity {
  @prop({ ref: () => Customer })
  customer: Ref<Customer>;

  @prop()
  stripe_customer_id: string;

  @prop({ required: true, enum: ItemModelTypes })
  itemRefPath: ItemModelTypes;

  @prop({ refPath: "itemRefPath" })
  item: Ref<Subscription> | Ref<Order>;

  @prop({ ref: () => Plan })
  plan: Ref<Plan>;

  @prop({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @prop({ enum: TransactionReason })
  reason: TransactionReason;

  @prop({ default: "Card" })
  payment_method: string;

  @prop({ default: "Stripe" })
  payment_gateway: string;

  @prop()
  reference: string;

  @prop()
  subscription_reference: string;

  @prop()
  order_reference: string;

  @prop()
  payment_intent: string;

  @prop()
  currency: string;

  @prop()
  amount: number;

  @prop()
  invoice_url: string;

  @prop()
  invoice_download_url: string;

  @prop({ ref: () => PromoCode })
  applied_promo: Ref<PromoCode>;
}

export default getModelForClass(Transaction);
