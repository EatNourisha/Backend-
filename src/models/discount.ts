// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { PromoCode } from "./promocode";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Discount extends BaseEntity {
  @prop({ ref: () => Customer })
  customer: Ref<Customer>;

  @prop({ ref: () => PromoCode })
  promo: Ref<PromoCode>;

  @prop({ default: false })
  used: boolean;

  @prop()
  used_on: "subscription" | "order";
}

export default getModelForClass(Discount);
