// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

@modelOptions({ schemaOptions: { timestamps: true } })
export class AuthToken extends BaseEntity {
  @prop()
  token: string;

  @prop()
  exp: number;

  @prop({ index: true })
  customer_id: string;

  @prop()
  last_login: Date;

  @prop()
  device_id: string;
}

export default getModelForClass(AuthToken);
