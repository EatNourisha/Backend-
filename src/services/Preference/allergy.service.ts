import { RoleService } from "../role.service";
import { createError, createSlug, paginate, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { Allergy, allergy } from "../../models";
import { CreateAllergyDto, IPaginationFilter } from "../../interfaces";

export class AllergyService {
  async createAllergy(dto: CreateAllergyDto, roles: string[]) {
    validateFields(dto, ["name", "description"]);
    await RoleService.hasPermission(roles, AvailableResource.ALLERGY, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await AllergyService.checkAllergyExists("slug", slug)) throw createError("Allergy already exists", 400);
    return await allergy.create({ ...dto, slug });
  }

  async getAllergies(roles: string[], filters?: IPaginationFilter) {
    await RoleService.hasPermission(roles, AvailableResource.ALLERGY, [PermissionScope.READ, PermissionScope.ALL]);
    return await paginate("allergy", {}, filters);
  }

  async getAllergyById(id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.ALLERGY, [PermissionScope.READ, PermissionScope.ALL]);
    const _allergy = await allergy.findById(id).lean<Allergy>().exec();
    if (!_allergy) throw createError("Allergy does not exist", 404);
    return _allergy;
  }

  async updateAllergy(id: string, dto: Partial<CreateAllergyDto>, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.ALLERGY, [PermissionScope.UPDATE, PermissionScope.ALL]);
    let updates: any = { ...dto };
    if (!!dto?.name) Object.assign(updates, { slug: createSlug(dto.name) });

    const _allergy = await allergy
      .findByIdAndUpdate(id, { ...updates }, { new: true })
      .lean<Allergy>()
      .exec();
    if (!_allergy) throw createError("Allergy does not exist", 404);
    return _allergy;
  }

  async deleteAllergy(id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.ALLERGY, [PermissionScope.DELETE, PermissionScope.ALL]);
    const _allergy = await allergy.findByIdAndDelete(id).lean<Allergy>().exec();
    if (!_allergy) throw createError("Allergy does not exist", 404);
    return _allergy;
  }

  static async checkAllergyExists(key: string, value: string): Promise<boolean> {
    const count = await allergy.countDocuments({ [key]: value }).exec();
    return count > 0;
  }
}
