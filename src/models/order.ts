// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Address, Customer } from "./customer";
import { OrderItem } from "./orderItem";
import { PromoCode } from "./promocode";

export enum OrderStatus {
  PROCESSING = "processing", // "processing payment"
  PAID = "payment_received", // "processing payment"
  CANCELLED = "cancelled",
  CONFIRMING = "confirming", // "confirming payment"
  ACCEPTED = "accepted", // "order has been confirmed"
  DISPATCHED = "dispatched",
  RECEIVED = "received",
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop()
  cart_id: string;

  @prop({ min: 0 })
  subtotal: number;

  @prop({ min: 0 })
  delivery_fee: number;

  @prop({ min: 0 })
  total: number;

  @prop({ enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @prop()
  delivery_date: Date;

  @prop()
  ref: string;

  @prop({ type: () => Address })
  delivery_address: Address;

  @prop()
  phone_number: string;

  @prop({ ref: () => OrderItem })
  items?: Ref<OrderItem>[];

  @prop({ ref: () => PromoCode })
  promo?: Ref<PromoCode>;

  @prop()
  actual_discounted_amount?: number;
}

export default getModelForClass(Order);
