// @ts-nocheck

import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Plan } from "./plan";
import { Card } from "./card";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Subscription extends BaseEntity {
  @prop({ required: false })
  stripe_id?: string;

  @prop({ ref: () => Plan })
  plan: Ref<Plan>;

  @prop({ ref: () => "Customer" })
  customer?: Ref<Customer>;

  @prop()
  country?: string;

  @prop()
  start_date: Date;

  @prop()
  end_date: Date;

  @prop()
  next_billing_date: Date;

  @prop()
  status: string;

  @prop({ ref: () => Card, required: false })
  card?: Ref<Card>;

  @prop()
  is_assigned_by_admin?: boolean;

  @prop()
  last_assigned_date?: Date;

  @prop()
  subscription_type: string;

  @prop()
  continent?: string;

  @prop()
  returning_client?: boolean;

  @prop()
  used_sub?: boolean;
}

export default getModelForClass(Subscription);
