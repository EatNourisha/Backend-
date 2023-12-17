import { PromoCode } from "models";

export interface CreatePromoCodeDto extends Omit<PromoCode, "_id" | "createdAt" | "updatedAt"> {}
