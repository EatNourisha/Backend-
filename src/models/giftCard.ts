// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Coupon } from "./coupon";
import { Customer } from "./customer";

enum CouponDuration {
  ONCE = "once",
  REPEATING = "repeating",
  FOREVEER = "forever",
}

export enum SubscriptionInterval {
  MONTHLY = "month",
}


@modelOptions({ schemaOptions: { timestamps: true } })
export class GiftCard extends BaseEntity {
  
  @prop({ default: 0 })
  amount: number;
  
  @prop()
  stripe_id: string;

  @prop()
  product_id: string;

  @prop()
  price_id: string;

  @prop()
  name: string;

  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ enum: SubscriptionInterval })
  subscription_interval: SubscriptionInterval;

}

export default getModelForClass(GiftCard);
