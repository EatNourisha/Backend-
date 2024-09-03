// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Inactiveusers extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop()
  firstname: string;

  @prop()
  lastname: string;

  @prop()
  address: any;

  @prop()
  phoneNumber: string;

  @prop()
  email: string;

  @prop()
  registration_date: Date;

  @prop()
  ref_code: string;

  @prop()
  stripe_cus_id: string;

  @prop()
  last_seen: Date;

  @prop()
  last_stripe_check: Date;



}

export default getModelForClass(Inactiveusers);
