// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Customer } from "./customer";

@modelOptions({ schemaOptions: { timestamps: true } })
export class CsTeam extends BaseEntity {
  @prop()
  added_by: Ref<Customer>;

  @prop()
  team_member: Ref<Customer>;
}

export default getModelForClass(CsTeam);
