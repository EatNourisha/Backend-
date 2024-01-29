import { MealPackAnalysis } from "models";

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
export interface SendPlacedOrderEmail {
  order_ref_id: string;
  name: string;
  email: string;
  delivery_date: string;
  delivery_address: string;
}

export interface SendPromoEmailDto {
  email: string;
  name: string;
  
}

export interface CreateMealPackAnalysisData extends Omit<MealPackAnalysis, "_id" | "createdAt" | "updatedAt"> {}
