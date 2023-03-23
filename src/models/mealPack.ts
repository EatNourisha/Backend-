// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Meal } from "./meal";

@modelOptions({ schemaOptions: { timestamps: true } })
export class MealPack extends BaseEntity {
  @prop()
  name: string;

  @prop({ lowercase: true })
  slug: string;

  @prop({ ref: () => Meal })
  meals: Ref<Meal>[];

  @prop()
  image_url: string;

  @prop({ default: true })
  is_available: boolean;
}

export default getModelForClass(MealPack);
