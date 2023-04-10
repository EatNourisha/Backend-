// @ts-nocheck

import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Plan } from "./plan";
import { Card } from "./card";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Subscription extends BaseEntity {
  @prop()
  stripe_id: string;

  @prop({ ref: () => Plan })
  plan: Ref<Plan>;

  @prop({ ref: () => "Customer" })
  customer?: Ref<Customer>;

  @prop()
  start_date: Date;

  @prop()
  end_date: Date;

  @prop()
  next_billing_date: Date;

  @prop()
  status: string;

  @prop({ ref: () => Card })
  card: Ref<Card>;
}

export default getModelForClass(Subscription);
