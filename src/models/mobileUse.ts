import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";


@modelOptions({ schemaOptions: { timestamps: true } })
export class MobileUse {
    @prop()
    data: string | string[];
}

export default getModelForClass(MobileUse);