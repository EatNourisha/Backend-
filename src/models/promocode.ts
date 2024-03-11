// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Coupon } from "./coupon";
import { Customer } from "./customer";

export class Influencer {
  @prop()
  first_name: string;

  @prop()
  last_name: string;

  @prop()
  email: string;

  @prop()
  phone_number: string;

  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;
}

class PromoCodeRetrictions {
  @prop()
  /// A Boolean indicating if the Promotion Code should only be redeemed for Customers without any successful payments or invoices
  first_time_transaction: boolean;

  @prop()
  /// Minimum amount required to redeem this Promotion Code into a Coupon (e.g., a purchase must be $100 or more to work)
  minimum_amount: number;

  @prop({ default: "gbp" })
  /// Three-letter ISO code for minimum_amount
  minimum_amount_currency: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class PromoCode extends BaseEntity {
  @prop()
  code: string;

  @prop({ ref: () => Coupon })
  coupon: Ref<Coupon>;

  @prop()
  stripe_id: string;

  @prop()
  active: boolean;

  @prop({ ref: () => Customer })
  /// The customer that this promotion code can be used by.
  customer: Ref<Customer>;

  @prop({ ref: () => Customer })
  /// The admin that created this promotion code.
  created_by: Ref<Customer>;

  @prop()
  /// Date at which the promotion code can no longer be redeemed.
  expires_at: Date;

  @prop()
  max_redemptions: number;

  @prop({ type: () => PromoCodeRetrictions, _id: false })
  restrictions: PromoCodeRetrictions;

  @prop()
  times_redeemed: number;

  @prop({ type: () => Influencer, _id: false })
  influencer: Influencer;

  @prop({ default: true })
  /// Means this promo code document doesn't give the customers any discounts.
  no_discount: boolean;
}

export default getModelForClass(PromoCode);
