export interface SendVerificationEmailDto {
  email: string;
  code: string;
  link: string;
  name: string;
}

export interface SendWelcomeEmailDto {
  email: string;
  name: string;
}

export interface SendResetPasswordEmailWebDto {
  email: string;
  name: string;
  link: string;
  token: string;
  sub: string; // subject -> customer's id
}
export interface SendResetPasswordEmailMobileDto {
  email: string;
  name: string;
  code: string;
}
