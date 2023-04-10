// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

export enum SubscriptionInterval {
  WEEKLY = "week",
  MONTHLY = "month",
}

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
  currency: string;

  @prop({ enum: SubscriptionInterval })
  subscription_interval: SubscriptionInterval;

  @prop({ type: () => [String] })
  perks: string[];
}

export default getModelForClass(Plan);
