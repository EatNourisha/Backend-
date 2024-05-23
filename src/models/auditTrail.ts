// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

@modelOptions({ schemaOptions: { timestamps: true } })
export class AuditTrail extends BaseEntity {
 @prop({ ref: () => "Customer" })
 route: string;

  @prop()
  status: string;

  @prop()
  action: string;

  @prop()
  dataSent: any;

  @prop()
  actor?: string;

  @prop()
  ip_address: string;

}

export default getModelForClass(AuditTrail);
