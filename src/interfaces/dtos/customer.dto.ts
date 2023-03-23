import { Address, DeliveryDay } from "../../models/customer";
import { Gender } from "../../valueObjects";
import { registerDto } from "./auth.dto";

export class CustomerDto extends registerDto {}

export class UpdateCustomerDto {
  first_name?: string;
  last_name?: string;
  avatar?: string;
  gender?: Gender;
  address?: Address;
}

export class VerifyEmailDto {
  customer_id: string;
  code: string;
}

export class ChangePasswordDto {
  current_password: string;
  new_password: string;
}

export class ResetPasswordDto {
  customer_id: string;
  token: string;
  password: string;
}

export class SetDeliveryDayDto {
  delivery_day: DeliveryDay;
}
