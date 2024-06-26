// @ts-nocheck

import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";
import { GiftCard } from "./giftCard";

export enum GiftStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REDEEMED = "redeemed",
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class GiftPurchase extends BaseEntity {
  @prop({ ref: () => "GiftCard" })
  gift_id: Ref<GiftCard>;
  
  @prop()
  reciever_email: string;

  @prop()
  reciever_name: string;
  
  @prop({default: 0})
  amount: number;
  
  @prop()
  gift_message?: string;

  @prop()
  code: string;

  @prop()
  reference: string;

  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop({ enum: GiftStatus, default: GiftStatus.PENDING })
  status: GiftStatus;

}

export default getModelForClass(GiftPurchase);
