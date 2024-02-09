// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Meal } from "./meal";

enum OrderType {
  Subscription = "subscription",
  SingleOrder = "single order",
}
class MealPackPrice {
  @prop({ default: 0 })
  amount: number;

  @prop({ default: 0 })
  previousAmount: number;

  @prop({ default: 0 })
  deliveryFee: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class MealPack extends BaseEntity {
  @prop()
  name: string;

  @prop({ lowercase: true })
  slug: string;

  @prop({ ref: () => Meal })
  meals: Ref<Meal>[];

  @prop()
  image_url: string;

  @prop()
  images: string[];

  @prop({ type: MealPackPrice, _id: false })
  price: MealPackPrice;

  @prop({ default: true })
  is_available: boolean;

  @prop()
  product_id: string;

  @prop()
  price_id: string;

  @prop()
  description: string;

  @prop()
  available_quantity: number;

  @prop({ enum: OrderType})
  orderType: OrderType;
}

export default getModelForClass(MealPack);
