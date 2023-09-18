import { CreateMealDto, CreateMealPackAnalysisData, CreateMealPackDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { meal, Meal, mealPack, MealPack, MealPackAnalysis, mealPackAnalysis } from "../../models";
import { RoleService } from "../../services/role.service";
import { createError, createSlug, getUpdateOptions, paginate, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";

export class MealService {
  async createMeal(dto: CreateMealDto, roles: string[]): Promise<Meal> {
    validateFields(dto, ["name"]);
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await MealService.checkMealExists("slug", slug)) throw createError("Meal already exist", 400);

    const _meal = await meal.create({ ...dto, slug });
    return _meal;
  }

  async createMealPack(dto: CreateMealPackDto, roles: string[]): Promise<MealPack> {
    validateFields(dto, ["name", "meals", "image_url"]);
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await MealService.checkMealPackExists("slug", slug)) throw createError("Meal pack already exist", 400);

    const _meal_pack = await mealPack.create({ ...dto, slug });
    return _meal_pack;
  }

  async updateMealPack(id: string, dto: Partial<CreateMealPackDto>, roles: string[]): Promise<MealPack> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.UPDATE, PermissionScope.ALL]);

    const mlp = await mealPack
      .findByIdAndUpdate(id, { ...dto }, { new: true })
      .lean<MealPack>()
      .exec();
    if (!mlp) throw createError("Meal pack does not exist", 400);
    return mlp;
  }

  async deleteMealPack(id: string, roles: string[]): Promise<MealPack> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.DELETE, PermissionScope.ALL]);

    const mlp = await mealPack.findByIdAndDelete(id).lean<MealPack>().exec();
    if (!mlp) throw createError("Meal pack does not exist", 400);
    return mlp;
  }

  async getMeals(roles: string[], filters?: IPaginationFilter): Promise<PaginatedDocument<Meal[]>> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    let queries = {};
    return await paginate("meal", queries, filters);
  }

  async getMealPacks(roles: string[], filters?: IPaginationFilter & { is_available: boolean }): Promise<PaginatedDocument<MealPack[]>> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    let queries: any = {};
    if (!(await RoleService.isAdmin(roles))) Object.assign(queries, { is_available: true });
    if (!!filters?.is_available && Boolean(filters.is_available)) Object.assign(queries, { is_available: true });

    return await paginate("mealPack", queries, filters);
  }

  async getMealById(id: string, roles: string[]): Promise<Meal> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    const _meal = await meal.findById(id).lean<Meal>().exec();
    if (!_meal) throw createError("Meal not found", 404);
    return _meal;
  }

  /**
   * ### Query Sample:
   * ```rest
   * /:id?meal_type=dinner,breakfast,lunch
   *     &customer=1
   *     &day=monday,tuesday...
   * ```
   */
  async getMealPackAnalysisById(
    id: string,
    roles: string[],
    filters?: IPaginationFilter & { meal_type: string; customer: string; day: string }
  ): Promise<PaginatedDocument<MealPackAnalysis[]>> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL_ANALYSIS, [PermissionScope.READ, PermissionScope.ALL]);

    let queries: { pack: string; customer?: string; $and?: any[] } = { pack: id };

    const days = String(filters?.day ?? "").split(",");
    const meal_types = String(filters?.meal_type ?? "").split(",");

    if (!!filters?.day) {
      queries = { ...queries, $and: [...(queries?.$and ?? [])] };
      queries.$and!.push({ $or: days.map((day) => ({ day })) });
    }

    if (!!filters?.meal_type) {
      // Not really important but good for DX, the downside is that it reduces execution time for the overall function runtime.
      // const supported_meal_types = ["breakfast", "dinner", "lunch"];
      // for (const mt of filters?.meal_type ?? []) {
      //   console.log("Supported", supported_meal_types);
      //   if (!supported_meal_types.includes(mt)) throw createError(`Supported meal_types are ${supported_meal_types.join(", ")}`, 400);
      // }

      queries = { ...queries, $and: [...(queries?.$and ?? [])] };
      queries.$and!.push({ $or: meal_types.map((meal_type) => ({ meal_type })) });
    }

    if (!!filters?.customer) {
      queries = { ...queries, $and: [...(queries?.$and ?? [])] };
      queries.customer = filters?.customer;
    }

    return await paginate("mealPackAnalysis", queries, filters, { populate: ["customer", "pack"] });
  }

  async getMealPackById(id: string, roles: string[]): Promise<MealPack> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    const _meal_pack = await mealPack.findById(id).populate("meals").lean<MealPack>().exec();
    if (!_meal_pack) throw createError("Meal pack not found", 404);
    return _meal_pack;
  }

  static async checkMealExists(key: keyof Meal, value: string): Promise<boolean> {
    const count = await meal.countDocuments({ [key]: value }).exec();
    return count > 0;
  }

  static async checkMealPackExists(key: keyof MealPack, value: string): Promise<boolean> {
    const count = await meal.countDocuments({ [key]: value }).exec();
    return count > 0;
  }

  static async createMealPackAnalysis(dto: CreateMealPackAnalysisData) {
    return await mealPackAnalysis.findOneAndUpdate(
      { day: dto?.day, customer: dto?.customer, meal_type: dto?.meal_type },
      { ...dto },
      getUpdateOptions()
    );
  }
}
