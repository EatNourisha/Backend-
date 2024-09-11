import { Gender } from "../../valueObjects";

export class loginDto {
  email: string;
  password: string;
  device_id?: string;
  temp_id?: string
}

export class registerDto {
  first_name: string;
  middle_name?: string;
  last_name: string;
  user_name: string;
  email: string;
  gender: Gender;
  password: string;
  phone: string;
  ref_code?: string;
  device_id?: string;
  temp_id?: string;
}
