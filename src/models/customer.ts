// @ts-nocheck
import { getModelForClass, index, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Gender } from "../valueObjects";
import BaseEntity from "./base";
import { Role } from "./role";
import { Subscription } from "./subscription";
import { Allergy } from "./allergy";
import { MealLineup } from "./mealLineup";
import { PromoCode } from "./promocode";
import { DeliveryInfo } from "./deliveryInfo";
import { Country } from "./country";

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
export class welcome {
  @prop({default:false})
  welcome1: boolean;

  @prop({default:false})
  welcome2: boolean;

  @prop({default:false})
  welcome3: boolean;

  @prop({default:false})
  welcome4: boolean;

  @prop({default:false})
  welcome5: boolean;

  @prop({default:false})
  welcome6: boolean;

  @prop({default:false})
  welcome7: boolean;

  @prop({default:false})
  welcome8: boolean;
}
export class reengage {
  @prop({default:false})
  reengage1: boolean;

  @prop({default:false})
  reengage2: boolean;

  @prop({default:false})
  reengage3: boolean;

  @prop({default:false})
  reengage4: boolean;

  @prop({default:false})
  reengage5: boolean;

  @prop({default:false})
  reengage6: boolean;

}
export class postsub {
  @prop({default:false})
  postsub1: boolean;

  @prop({default:false})
  postsub2: boolean;

  @prop({default:false})
  postsub3: boolean;

  @prop({default:false})
  postsub4: boolean;

  @prop({default:false})
  postsub5: boolean;

  @prop({default:false})
  postsub6: boolean;

  @prop({default:false})
  postsub7: boolean;

  @prop({default:false})
  postsub8: boolean;

  @prop({default:false})
  postsub9: boolean;

  @prop({default:false})
  postsub10: boolean;

  @prop({default:false})
  postsub11: boolean;

  @prop({default:false})
  postsub12: boolean;

  @prop({default:false})
  postsub13: boolean;
}

export class cart {
  @prop({default:false})
  cart1: boolean;

  @prop({default:false})
  cart2: boolean;

  @prop({default:false})
  cart3: boolean;

  @prop({default:false})
  cart4: boolean;

  @prop({default:false})
  cart5: boolean;

  @prop({default:false})
  cart6: boolean;

  @prop({default:false})
  cart7: boolean;

  @prop({default:false})
  cart8: boolean;

  @prop({default:false})
  cart9: boolean;

  @prop({default:false})
  cart10: boolean;

  @prop({default:false})
  cart11: boolean;
}

export class course {
  @prop({default:false})
  course1: boolean;

  @prop({default:false})
  course2: boolean;

  @prop({default:false})
  course3: boolean;

  @prop({default:false})
  course4: boolean;

}

export class retention {
  @prop({default:false})
  retention1: boolean;

  @prop({default:false})
  retention2: boolean;

  @prop({default:false})
  retention3: boolean;

  @prop({default:false})
  retention4: boolean;

}

// export class Emails {
//   @prop()
//   welcome: welcome;

//   @prop()
//   reengage: reengage;

//   @prop()
//   postsub: postsub;

//   @prop()
//   course: course;

//   @prop()
//   retention: retention;

//   @prop()
//   cart: cart;
// }

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

  @prop({ default: false })
  auto_renew: boolean;
}

export class CustomerPromo {
  @prop({ ref: () => "PromoCode" })
  promo: Ref<PromoCode>;

  @prop({ default: false })
  used_up: boolean;

  @prop({ default: 0 })
  no_of_use: number;
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

  @prop({ ref: () => "DeliveryInfo" })
  delivery_info: Ref<DeliveryInfo>;

  @prop()
  delivery_date: Date;

  @prop({ ref: () => Country }) 
  country: Ref<Country>;

  @prop({ ref: () => Subscription })
  subscription: Ref<Subscription>;

  @prop({ ref: () => MealLineup })
  lineup: Ref<MealLineup>;

  @prop({ type: () => CustomerPreference, _id: false })
  preference: CustomerPreference;

  @prop()
  notes: string;

  @prop()
  subscription_status: string;

  @prop()
  last_stripe_check: Date;

  @prop({ ref: () => "PromoCode" })
  pending_promo: Ref<PromoCode>;

  @prop()
  assigned_cs?: string[];

  @prop()
  follow_up?: string[];

  @prop()
  report?: string[];

  @prop()
  temp_id?: string;

  @prop()
  device_id?: string;

  @prop({default: Date.now})
  lastLineupReset: Date;

  @prop({default: 0})
  lineupCount: number;

  @prop({default: 'Newbie'})
  level: string;

  @prop({default: false})
  newUser: boolean;

  @prop()
  activeLineup: boolean;

  @prop()
  WELCOMEMAILS: welcome;

  @prop()
  REENGAGEEMAILS: reengage;

  @prop()
  POSTSUBEEMAILS: postsub;

  @prop()
  CARTEMAILS: cart;

  @prop()
  lastPasswordReset: string;

  @prop()
  platform?: string;

  @prop()
  lastLoggedPlatform?: string;
}

export default getModelForClass(Customer);
