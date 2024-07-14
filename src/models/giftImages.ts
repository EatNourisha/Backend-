// @ts-nocheck

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";

@modelOptions({ schemaOptions: { timestamps: true } })
export class GiftImages extends BaseEntity {
  @prop()
  name: string;

  @prop()
  image_url: string;
}

export default getModelForClass(GiftImages);
