// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Meal } from "./meal";
import { Category } from "./category";

export enum OrderType {
  Subscription = "subscription",
  SingleOrder = "single order",
  BulkOrder = "bulk-order",
  Both = "both",
}
class MealPackPrice {
  @prop({ default: 0 })
  amount: number;

  @prop({ default: 0 })
  previousAmount: number;

  @prop({ default: 0 })
  deliveryFee: number;
}

class MealInfo {
  @prop()
  ingredient?: string;

  @prop()
  prehitting_instruction?: string;

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

  @prop()
  country: string;

  @prop()
  calories?: number;

  @prop()
  spice_level?: string;

  @prop()
  tag?: string;

  @prop()
  category?: string;

  @prop({default:false})
  isSwallow?: boolean;

  @prop({default:false})
  isProtein?: boolean;

  @prop()
  continent: string;

  @prop()
  weight?: string;

  @prop({ type: MealInfo, _id: false })
  mealInfo?: MealInfo;


}

export default getModelForClass(MealPack);
