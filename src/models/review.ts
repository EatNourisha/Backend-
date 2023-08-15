

// @ts-nocheck

import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review extends BaseEntity {

  @prop({ ref: () => "Customer" })
  customer?: Ref<Customer>;

  @prop()
  rating: number

  @prop()
  content: string;
}

export default getModelForClass(Review);
