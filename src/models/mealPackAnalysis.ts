// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Meal } from "./meal";
import { MealPack } from "./mealPack";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class MealPackAnalysis extends BaseEntity {
  @prop({ ref: () => MealPack })
  pack: Ref<MealPack>;

  @prop({ ref: () => Customer })
  customer: Ref<Customer>;

  @prop()
  day: string;

  @prop()
  meal_type: "breakfast" | "lunch" | "dinner";
}

export default getModelForClass(MealPackAnalysis);
