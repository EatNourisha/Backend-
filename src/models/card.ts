// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Card extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop()
  brand: string;

  @prop()
  token: string;

  @prop()
  stripe_customer_id: string;

  @prop()
  country: string;

  @prop()
  exp_month: number;

  @prop()
  exp_year: number;

  @prop()
  fingerprint: string;

  @prop()
  last4: string;

  @prop()
  postal_code: string;
}

export default getModelForClass(Card);
