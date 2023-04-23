// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Allergy extends BaseEntity {
  @prop()
  name: string;

  @prop({ lowercase: true })
  slug: string;

  @prop()
  description: string;
}

export default getModelForClass(Allergy);
