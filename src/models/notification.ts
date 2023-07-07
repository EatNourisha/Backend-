// @ts-nocheck

import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

export type NotificationType = "subscription" | "lineup";
export type NotificationStatus = "read" | "unread";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Notification extends BaseEntity {
  @prop()
  tag: string;

  @prop()
  title: string;

  @prop({ ref: () => Customer })
  customer: Ref<Customer>;

  @prop()
  content: string;

  @prop()
  metadata: any;

  @prop()
  isAdmin: boolean;

  @prop({ default: false, select: false })
  delivered: boolean;

  @prop({ default: "unread" })
  status: NotificationStatus;
}

export default getModelForClass(Notification);
