import { AdminSettingsDto } from "../../interfaces";
import { AdminSettings, Customer, adminSettings, customer } from "../../models";
import { RoleService } from "../role.service";
import { createError, getUpdateOptions, validateFields } from "../../utils";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { InfluencerRewardType } from "../../models/adminSettings";

export class AdminSettingsService {
  async getSettings(roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.ADMIN_SETTINGS, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    const settings = await adminSettings.findOne({ name: "settings" }).lean<AdminSettings>().exec();
    if (!settings) throw createError(`Settings not found`, 404);
    return settings;
  }

  async updateSettings(customer_id: string, dto: Partial<AdminSettingsDto>, roles: string[]) {
    if (!!dto?.influencer_reward) validateFields(dto?.influencer_reward, ["amount", "type"]);
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.ADMIN_SETTINGS, [
      PermissionScope.UPDATE,
      PermissionScope.ALL,
    ]);

    const amount = dto?.influencer_reward?.amount ?? 0;
    if (dto?.influencer_reward?.type === InfluencerRewardType.PERCENTAGE && (amount < 0 || amount > 100))
      throw createError(`Invalid influencer amount: value must be greater than zero (0) and less than or equal to 100`);

    const cus = await customer.findById(customer_id).select("_id").lean<Customer>().exec();
    if (!cus) throw createError("Admin account not found", 404);

    const settings = await adminSettings
      .findOneAndUpdate({ name: "settings" }, { name: "settings", last_updated_by: cus, ...dto }, getUpdateOptions())
      .lean<AdminSettings>()
      .exec();
    return settings;
  }
}
