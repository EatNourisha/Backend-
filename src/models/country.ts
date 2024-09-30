import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";


@modelOptions({ schemaOptions: { timestamps: true } })
export class Country extends BaseEntity {
  @prop()
  name: string;
  
  @prop()
  country_flag?: string;

  @prop()
  code?: string; 

  @prop()
  continent?: string;

  @prop()
  weeklyPrice?: number;

  @prop()
  monthlyPrice?: number;

  @prop()
  weeklyWeekendPrice?: number;

  @prop()
  monthlyWeekendPrice?: number;
}

export default getModelForClass(Country);
