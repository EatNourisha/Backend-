import { GiftCard, CustomGift, GiftImages } from "models";

export interface GiftCardDto extends Omit<GiftCard, "_id" | "createdAt" | "updatedAt"> {}
export interface CustomGiftDto extends Omit<CustomGift, "_id" | "createdAt" | "updatedAt"> {}
export interface GiftImageDto extends Omit<GiftImages, "_id" | "createdAt" | "updatedAt"> {}
