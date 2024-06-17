import { GiftCard } from "models";

export interface GiftCardDto extends Omit<GiftCard, "_id" | "createdAt" | "updatedAt"> {}
