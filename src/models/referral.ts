// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Plan } from "./plan";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Referral extends BaseEntity {

  @prop({ ref: () => "Customer" })
  inviter?: Ref<Customer>;

  @prop({ ref: () => "Customer" })
  invitee?: Ref<Customer>;

  @prop({ ref: () => "Plan" })
  subscription_plan?: Ref<Plan>;

  @prop({default: false})
  is_subscribed: boolean;

  @prop()
  ref_code: string;

  @prop({default: 10})
  reward: number;

  @prop()
  currency: 'gbp'

  @prop({default: false})
  is_paid: boolean;
}

export default getModelForClass(Referral);
