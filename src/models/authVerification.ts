// @ts-nocheck

import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { AuthVerificationReason } from "../valueObjects";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class AuthVerification extends BaseEntity {
  @prop()
  code?: string;

  @prop()
  token?: string;

  @prop()
  exp?: number;

  @prop({ index: true, ref: () => Customer })
  customer_id: Ref<Customer>;

  @prop({ index: true })
  verified: boolean;

  @prop({ enum: AuthVerificationReason })
  reason: AuthVerificationReason;
}

export default getModelForClass(AuthVerification);
