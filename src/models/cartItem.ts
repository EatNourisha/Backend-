// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { Cart } from "./cart";
import { MealPack } from "./mealPack";
import { MealExtras } from "./mealExtras";

@modelOptions({ schemaOptions: { timestamps: true } })
export class CartItem extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ ref: () => "Cart" })
  cart: Ref<Cart>;

  @prop({ ref: () => "MealPack" })
  item: Ref<MealPack>;

  @prop({ ref: () => "MealExtras" })
  protein?: Ref<MealExtras>;

  @prop({ ref: () => "MealExtras" })
  swallow?: Ref<MealExtras>;

  @prop({ min: 0 })
  quantity: number;

  @prop()
  session_id: string;
}

export default getModelForClass(CartItem);
