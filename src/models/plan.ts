// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

export enum SubscriptionInterval {
  WEEKLY = "week",
  MONTHLY = "month",
}

@index({ "$**": "text" }) // to make the $text.$search work.
@modelOptions({ schemaOptions: { timestamps: true } })
export class Plan extends BaseEntity {
  @prop()
  product_id: string;

  @prop()
  price_id: string;

  @prop()
  name: string;

  @prop()
  description: string;

  @prop({ lowercase: true })
  slug: string;

  @prop()
  amount: number;

  @prop()
  country: string;

  @prop()
  delivery_fee: number;

  @prop()
  currency: string;

  @prop({ default: false })
  weekend?: boolean;

  @prop({ enum: SubscriptionInterval })
  subscription_interval: SubscriptionInterval;

  @prop({ type: () => [String] })
  perks: string[];

  @prop({ default: false })
  five_day?: boolean;

  @prop()
  continent?: string;

  @prop()
  meal_number?: number;

  @prop()
  amount_permeal?: number;

}

export default getModelForClass(Plan);
