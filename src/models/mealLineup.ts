// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { MealPack } from "./mealPack";
import { MealExtras } from "./mealExtras";

export class DayMeals {
  @prop({ ref: () => MealPack })
  breakfast: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  lunch: Ref<MealPack>;

  @prop({ ref: () => MealPack })
  dinner: Ref<MealPack>;
}

export class Extras {
  @prop({ ref: () => MealExtras })
  extra: Ref<MealExtras>;

}

export enum StatusActivity {
ACTIVE= "active",
DEACTIVATED= "deactivated"
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

  @prop({enum: StatusActivity, default: StatusActivity.ACTIVE})
  status?: StatusActivity;

  @prop({type: () => Extras, _id: false })
  extras:Extras;

  @prop()
  sub_end_date: Date;

}

export default getModelForClass(MealLineup);
