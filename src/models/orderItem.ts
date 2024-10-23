// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { Order } from "./order";
import { MealPack } from "./mealPack";
import { MealExtras } from "./mealExtras";

export class Extras {
  @prop({ ref: () => "MealPack", _id: false })
  item: Ref<MealPack>;

  @prop({ ref: () => "MealExtras", _id: false })
  protein?: Ref<MealExtras>;

  @prop({ ref: () => "MealExtras", _id: false })
  swallow?: Ref<MealExtras>;
}


@modelOptions({ schemaOptions: { timestamps: true } })
export class OrderItem extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ ref: () => "Order" })
  order: Ref<Order>;

  @prop({ ref: () => "MealPack" })
  item: Ref<MealPack>;

  @prop({ min: 1 })
  quantity: number;

  @prop()
  cart_session_id: string;

  @prop({ type: () => Extras, _id: false })
  extras?: Extras;
}

export default getModelForClass(OrderItem);
