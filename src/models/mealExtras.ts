// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

@modelOptions({ schemaOptions: { timestamps: true } })
export class MealExtras extends BaseEntity {
  @prop()
  name: string;

  @prop()
  image_url?: string;
  
  @prop()
  type?: string;
  
  @prop()
  meal_type?: string;
}

export default getModelForClass(MealExtras);
