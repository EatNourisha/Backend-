// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Plan } from "./plan";

@modelOptions({ schemaOptions: { timestamps: true } })
export class DeliveryInfo extends BaseEntity {

  @prop({ ref: () => "Customer" })
  customer?: Ref<Customer>;

  @prop()
  next_delivery_date?: Date;

  @prop({default: 'sunday'})
  delivery_day: string;

  @prop()
  next_lineup_change_date: Date;

  @prop({default: false})
  is_lineup_change_locked: boolean;
 
}

export default getModelForClass(DeliveryInfo);
