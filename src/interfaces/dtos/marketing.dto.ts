import { Address } from "../../models/customer";

export interface UpdateContactSubscriptionDto {
  plan_name: string;
  sub_status: string;
  plan_type: string;
  addr?: Address;
}
