import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import BaseEntity from "./base";

class Android {
  @prop({ required: true })
  update!: boolean;

  @prop({ required: true })
  version!: string;

  @prop({ required: true })
  force!: boolean;

  @prop({ required: true })
  build!: string;

  @prop({ required: true })
  link!: string;
}

class IOS {
  @prop({ required: true })
  update!: boolean;

  @prop({ required: true })
  version!: string;

  @prop({ required: true })
  force!: boolean;

  @prop({ required: true })
  build!: string;

  @prop({ required: true })
  link!: string;
}
@modelOptions({ schemaOptions: { timestamps: true } })
export class AppUpdate extends BaseEntity  {
  @prop({ required: true })
  android!: Android;

  @prop({ required: true })
  ios!: IOS;
}

export default getModelForClass(AppUpdate);