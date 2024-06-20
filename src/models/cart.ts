// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Cart extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ min: 0 })
  subtotal: number;

  @prop({ min: 0 })
  deliveryFee: number;

  @prop({ min: 0 })
  total: number;

  @prop()
  session_id: string;

  // @prop({ default: false })
  // delivery_weekend: boolean;

  // @prop({ default: 'in-week' })
  // del_period: string;
}

export default getModelForClass(Cart);
