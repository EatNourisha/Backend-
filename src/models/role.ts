// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
// import { Permission } from "./rolePermission";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Role extends BaseEntity {
  @prop({ unique: true, lowercase: true })
  name: string;

  @prop({ index: true, unique: true })
  slug?: string;
}

export default getModelForClass(Role);
