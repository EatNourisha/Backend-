// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Meal extends BaseEntity {
  @prop()
  name: string;

  @prop({ lowercase: true })
  slug: string;

  @prop()
  image_url: string;
}

export default getModelForClass(Meal);
