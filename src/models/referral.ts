// @ts-nocheck

import { Ref, getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Plan } from "./plan";
import { PromoCode } from "./promocode";

@index({ "$**": "text" }) // to make the $text.$search work.
@modelOptions({ schemaOptions: { timestamps: true } })
export class Referral extends BaseEntity {
  @prop({ ref: () => "Customer" })
  inviter?: Ref<Customer>;

  @prop({ ref: () => "Customer" })
  invitee?: Ref<Customer>;

  @prop({ ref: () => "Plan" })
  subscription_plan?: Ref<Plan>;

  @prop({ default: false })
  is_subscribed: boolean;

  @prop()
  ref_code: string;

  @prop({ default: 10 })
  reward: number;

  @prop()
  currency: "gbp";

  @prop({ default: false })
  is_paid: boolean;

  @prop({ default: false })
  is_promotion: boolean;

  @prop({ ref: () => PromoCode })
  promo: Ref<PromoCode>;
}

export default getModelForClass(Referral);
