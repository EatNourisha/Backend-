import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";


@modelOptions({ schemaOptions: { timestamps: true } })
export class Country extends BaseEntity {
  @prop()
  name: string;

  @prop()
  code?: string;
}

export default getModelForClass(Country);
