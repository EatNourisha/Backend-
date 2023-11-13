// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { Order } from "./order";
import { MealPack } from "./mealPack";

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
}

export default getModelForClass(OrderItem);
