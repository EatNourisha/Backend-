// @ts-nocheck
import { getModelForClass, index, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Gender } from "../valueObjects";
import BaseEntity from "./base";
import { Role } from "./role";
import { Subscription } from "./subscription";
import { Allergy } from "./allergy";
import { MealLineup } from "./mealLineup";

export class AccountControl {
  @prop({ default: false })
  suspended: boolean;
}

export class Address {
  @prop()
  address_: string;

  @prop()
  city: string;

  @prop()
  country: string;

  @prop()
  postcode: string;
}

export enum DeliveryDay {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export class CustomerPreference {
  @prop({ ref: () => "Allergy" })
  allergies: Ref<Allergy>[];

  @prop({ default: false, select: false })
  is_lineup_locked: boolean;

  @prop()
  next_lineup_change_exp: number;
}

@index({ "$**": "text" }) // to make the $text.$search work.
@modelOptions({ schemaOptions: { timestamps: true } })
export class Customer extends BaseEntity {
  @prop()
  first_name: string;

  @prop()
  last_name: string;

  @prop()
  avatar?: string;

  @prop({ trim: true, lowercase: true })
  email: string;

  @prop({ select: false })
  password: string;

  @prop()
  primary_role?: string;

  @prop()
  last_seen: Date;

  @prop()
  phone: string;

  @prop({ enum: Gender })
  gender: Gender;

  @prop({ type: () => Address, _id: false })
  address: Address;

  @prop()
  stripe_id: string;

  @prop({ ref: () => Role })
  roles?: Ref<Role>[];

  @prop({ type: () => AccountControl, _id: false })
  control?: AccountControl;

  @prop({ default: false })
  is_email_verified?: boolean;

  @prop({ index: true, unique: true })
  ref_code: string;

  @prop({ enum: DeliveryDay })
  delivery_day: DeliveryDay;

  @prop({ ref: () => Subscription })
  subscription: Ref<Subscription>;

  @prop({ ref: () => MealLineup })
  lineup: Ref<MealLineup>;

  @prop({ type: () => CustomerPreference, _id: false })
  preference: CustomerPreference;

  @prop()
  notes: string;
}

export default getModelForClass(Customer);
