import { AdminSettings } from "../../models";

export interface AdminSettingsDto extends Omit<AdminSettings, "_id" | "name" | "createdAt" | "updatedAt"> {}
