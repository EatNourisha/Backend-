// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

enum CouponDuration {
  ONCE = "once",
  REPEATING = "repeating",
  FOREVEER = "forever",
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Coupon extends BaseEntity {
  @prop({ default: 0 })
  amount_off: number;

  @prop({ default: "gbp" })
  currency: string;

  @prop({ enum: CouponDuration })
  duration: CouponDuration;

  @prop()
  duration_in_months: number;

  @prop()
  max_redemptions: number;

  @prop()
  name: string;

  @prop({ default: 0 })
  percent_off: number;

  @prop()
  redeem_by: Date;

  @prop()
  times_redeemed: number;

  @prop()
  valid: boolean;

  @prop()
  stripe_id: string;

  @prop()
  required_for?: "promo";
}

export default getModelForClass(Coupon);
