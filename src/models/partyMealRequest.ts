// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Address, Customer } from "./customer";

enum PartyMealRequestStatus {
  PENDING = "pending",
  PROCESSING = "processing",
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class PartyMealRequest extends BaseEntity {
  @prop({ ref: () => "Customer" })
  customer: Ref<Customer>;

  @prop()
  first_name: string;

  @prop()
  last_name: string;

  @prop()
  email: string;

  @prop()
  country: string;

  @prop({ type: () => Address })
  address: Address;

  @prop()
  event_date: Date;

  @prop()
  number_of_guests: number;

  @prop()
  event_type: string;

  @prop()
  phone_number: string;

  @prop()
  meals: string;

  @prop()
  is_guest: boolean;

  @prop({ enum: PartyMealRequestStatus, default: PartyMealRequestStatus.PENDING })
  status: PartyMealRequestStatus;
}

export default getModelForClass(PartyMealRequest);
