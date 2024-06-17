import { GiftPurchase } from "models";

export interface GiftPurchaseDto extends Omit<GiftPurchase, "_id" | "createdAt" | "updatedAt"> {}
