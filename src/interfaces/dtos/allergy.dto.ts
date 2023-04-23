import { Allergy } from "models";

export interface CreateAllergyDto extends Omit<Allergy, "_id" | "createdAt" | "updatedAt"> {}
