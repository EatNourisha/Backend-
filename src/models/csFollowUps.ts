// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class CsFollowUp extends BaseEntity {
  @prop()
  by: Ref<Customer>;

  @prop()
  customer: Ref<Customer>;

  @prop()
  text: string;
}

export default getModelForClass(CsFollowUp);
