// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { MealPack } from "./mealPack";
import { MealExtras } from "./mealExtras";
import { Plan } from "./plan";

export enum StatusActivity {
ACTIVE= "active",
DEACTIVATED= "deactivated"
}


export class SelectObj {
  @prop({ ref: () => MealPack, _id: false })
  mealId: Ref<MealPack>;

  @prop()
  quantity: number;

}

@modelOptions({ schemaOptions: { timestamps: true } })
export class FoodBox extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ type: () => [SelectObj] })
  selections?: SelectObj[];

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

  @prop({default:false})
  isReturningCustomer?: boolean;

  @prop()
  coupon_applied?: string;

  @prop()
  platform?: string;

  @prop({ ref: () => "Customer" })
  createdBy: Ref<Customer>;

  @prop({ ref: () => "Customer" })
  editedBy: Ref<Customer>;


}

export default getModelForClass(FoodBox);
