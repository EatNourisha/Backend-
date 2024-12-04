// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { Cart } from "./cart";
import { MealPack } from "./mealPack";
import { MealExtras } from "./mealExtras";

export class ExtraDetailDto {

  @prop({ ref: () => MealExtras, _id: false })
  proteinId?: Ref<MealExtras>;

  @prop({ ref: () => MealExtras, _id: false })
  swallowId?: Ref<MealExtras>;

  @prop()
  quantity?: number;

  // @prop({ ref: () => "MealPack", _id: false })
  // item: Ref<MealPack>;
}


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

  @prop({ ref: () => "MealExtras" })
  proteins?: Ref<MealExtras>[];
  
  @prop({ ref: () => "MealExtras" })
  swallows?: Ref<MealExtras>[];

  @prop({ min: 0 })
  quantity: number;

  @prop()
  session_id: string;

  @prop({ type: () => [ExtraDetailDto] })
  swallowss?: ExtraDetailDto[];

  @prop({ type: () => [ExtraDetailDto] })
  proteinss?:ExtraDetailDto[];
}

export default getModelForClass(CartItem);
