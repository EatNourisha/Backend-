import { Meal, MealLineup, MealPack, PartyMealRequest, Category } from "../../models";

export interface CreateMealDto extends Omit<Meal, "_id" | "created_at" | "updated_at"> {}
export interface CreateMealPackDto extends Omit<MealPack, "_id" | "created_at" | "updated_at"> {}
export interface CreateCategoryDto extends Omit<Category, "_id" | "created_at" | "updated_at"> {}

export interface CreateLineupDto extends Omit<MealLineup, "_id" | "created_at" | "updated_at"> {}

export interface RequestPartyMealDto extends Omit<PartyMealRequest, "_id" | "createdAt" | "updatedAt"> {}
