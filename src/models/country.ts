import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";


@modelOptions({ schemaOptions: { timestamps: true } })
export class Country extends BaseEntity {
  @prop()
  name: string;

  @prop()
  code?: string;

  @prop()
  weeklyPrice?: number;

  @prop()
  monthlyPrice?: number;
}

export default getModelForClass(Country);
