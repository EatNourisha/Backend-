import { Card, Plan, Subscription, Transaction } from "../../models";

export interface CreatePlanDto extends Omit<Plan, "_id" | "createdAt" | "updatedAt"> {}

export interface CreateCheckoutSessionDto {
  price_id: string;
}

export interface CreateCardDto extends Omit<Card, "_id" | "createdAt" | "updatedAt"> {}

export interface InitiateSubscriptionDto {
  plan_id: string;
  card_token?: string;
}

export interface CreateSubscriptionDto extends Omit<Subscription, "_id" | "createdAt" | "updatedAt"> {}

export interface updateTransactionDto extends Partial<Omit<Transaction, "_id" | "createdAt" | "updatedAt">> {}

