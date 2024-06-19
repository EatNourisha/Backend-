// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Coupon } from "./coupon";
import { Customer } from "./customer";

// enum CouponDuration {
//   ONCE = "once",
//   REPEATING = "repeating",
//   FOREVEER = "forever",
// }

export enum SubscriptionInterval {
  MONTHLY = "month",
//   WEEKLY = "week",
}


@modelOptions({ schemaOptions: { timestamps: true } })
export class CustomGift extends BaseEntity {
  
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

  @prop({ enum: SubscriptionInterval, default: SubscriptionInterval.MONTHLY })
  subscription_interval: SubscriptionInterval;

}

export default getModelForClass(CustomGift);
