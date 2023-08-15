import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import BaseEntity from "./base";
import { Referral } from "./referral";
import { Customer } from "./customer";


class AccountInfo {
    @prop()
    bank_number: string

    @prop()
    bank_name: string

    @prop()
    link: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class WithdrawalRequest extends BaseEntity {

  @prop({ ref: () => "Customer" })
  customer?: Ref<Customer>;

  @prop({default: 0})
  amount: number;

  @prop({_id: false, type: () => AccountInfo})
  account_info: AccountInfo

  @prop({ref: () => Referral})
  refs: Ref<Referral>[]

  @prop({default: false})
  is_fulfilled: boolean
}

export default getModelForClass(WithdrawalRequest);
