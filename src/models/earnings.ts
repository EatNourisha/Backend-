// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Plan } from "./plan";
import { Referral } from "./referral";
import { PromoCode } from "./promocode";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Earnings extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer?: Ref<Customer>;

  @prop({ default: 0 })
  balance: number;

  @prop({ ref: () => PromoCode })
  promo: Ref<PromoCode>;

  @prop({ ref: () => Referral })
  refs: Ref<Referral>[];
}

export default getModelForClass(Earnings);
