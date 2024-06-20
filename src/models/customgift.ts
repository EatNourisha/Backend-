// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Coupon } from "./coupon";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class CustomGift extends BaseEntity {
  
  @prop({ default: 0 })
  amount: number;
  
  @prop()
  name: string;

  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

}

export default getModelForClass(CustomGift);
