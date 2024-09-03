// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { MealPack } from "./mealPack";
import { MealExtras } from "./mealExtras";
import { Plan } from "./plan";

class ExtraDetail {
  @prop({_id: false})
  day?: string;
   
  @prop({_id: false, _id: false})
  mealType?: string;

  @prop({ ref: () => MealPack, _id: false })
  mealId: Ref<MealPack>;

  @prop({ ref: () => MealExtras, _id: false })
  extraId?: Ref<MealExtras>;
}
export class DayMeals {
  @prop({_id: false})
  breakfast: ExtraDetail;

  @prop({_id: false})
  lunch: ExtraDetail;

  @prop({_id: false})
  dinner: ExtraDetail;
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
  saturday?: DayMeals;

  @prop({ type: () => DayMeals, _id: false })
  sunday?: DayMeals;

  @prop()
  delivery_date: Date;

  @prop({default:1})
  week: number;

  @prop({default:false})
  swallow?: boolean;

  @prop({enum: StatusActivity, default: StatusActivity.ACTIVE})
  status?: StatusActivity;

  @prop()
  sub_end_date: Date;

  @prop({default: 'pending'})
  delivery_status: string;

  @prop({ ref: () => Plan })
  plan: Ref<Plan>;

  @prop({default:false})
  in_week?: boolean;

}

export default getModelForClass(MealLineup);
