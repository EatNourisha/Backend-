// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

export enum DeliveryFeeCalculationType {
  FIXED = "fixed",
  PER_MEAL = "per_meal",
}

export enum InfluencerRewardType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
}

class InfluencersReward {
  @prop({ enum: InfluencerRewardType, default: InfluencerRewardType.FIXED })
  type: InfluencerRewardType;

  @prop()
  amount: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class AdminSettings extends BaseEntity {
  @prop()
  name: string;

  @prop({ min: 0 })
  delivery_fee: number;

  @prop({ ref: () => Customer })
  last_updated_by: Ref<Customer>;

  @prop({ enum: DeliveryFeeCalculationType, default: DeliveryFeeCalculationType.FIXED })
  delivery_fee_calculation_type: DeliveryFeeCalculationType;

  @prop({ default: "gbp" })
  currency: string;

  @prop({ type: InfluencersReward })
  influencer_reward: InfluencersReward;

  @prop()
  wed_sat?: Date;

  @prop()
  sun_tue?: Date;

}

export default getModelForClass(AdminSettings);
