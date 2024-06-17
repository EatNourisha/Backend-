// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { MealPack } from "./mealPack";

export class DayMeals {
  @prop({ ref: () => MealPack })
  breakfast: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  lunch: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  dinner: Ref<MealPack>;
}

export enum Extras {
  GARRI = "garri",
  SEMO ="semo",
  POUNDED_YAM ="pounded_yam",
  FUFU ="fufu"
}
@modelOptions({ schemaOptions: { timestamps: true } })
export class MealLineup extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ type: () => DayMeals, _id: false })
  monday: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  tuesday: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  wednesday: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  thursday: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  friday: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  saturday: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  sunday: DayMeals;

  @prop()
  delivery_date: Date;

  @prop({default:1})
  week: number;

  @prop({default:false})
  swallow?: boolean;

  @prop({enum: Extras})
  extras?: Extras;

}

// Validate the object ID before assigning
function isValidObjectId(id: any): id is Types.ObjectId {
  return Types.ObjectId.isValid(id);
}



export default getModelForClass(MealLineup);
