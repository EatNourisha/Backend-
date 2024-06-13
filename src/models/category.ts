// @ts-nocheck
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Category extends BaseEntity {
  @prop()
  name: string;
}

export default getModelForClass(Category);
