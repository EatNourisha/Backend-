// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { MealPack } from "./mealPack";

@modelOptions({ schemaOptions: { timestamps: true } })
export class MealLineup extends BaseEntity {
  @prop({ ref: () => Customer })
  customer: Ref<Customer>;

  @prop({ ref: () => MealPack })
  monday: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  tuesday: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  wednesday: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  thursday: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  friday: Ref<MealPack>;
}

export default getModelForClass(MealLineup);
