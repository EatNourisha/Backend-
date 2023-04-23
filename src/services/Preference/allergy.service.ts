import { RoleService } from "../role.service";
import { createError, createSlug, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { allergy } from "../../models";
import { CreateAllergyDto } from "../../interfaces";

export class AllergyService {
  async createAllergy(dto: CreateAllergyDto, roles: string[]) {
    validateFields(dto, ["name", "description"]);
    await RoleService.hasPermission(roles, AvailableResource.ALLERGY, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await AllergyService.checkAllergyExists("slug", slug)) throw createError("Allergy already exists", 400);
    return await allergy.create({ ...dto, slug });
  }

  static async checkAllergyExists(key: "slug", value: string): Promise<boolean> {
    const count = await allergy.countDocuments({ [key]: value }).exec();
    return count > 0;
  }
}
