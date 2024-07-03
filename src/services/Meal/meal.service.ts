// import Stripe from "stripe";
import {
  CreateMealDto,
  CreateMealPackAnalysisData,
  CreateMealPackDto,
  IPaginationFilter,
  PaginatedDocument,
  RequestPartyMealDto,
  CreateExtrasDto
} from "../../interfaces";
import {
  customer,
  meal,
  Meal,
  mealextras,
  MealExtras,
  mealPack,
  MealPack,
  MealPackAnalysis,
  mealPackAnalysis,
  PartyMealRequest,
  partyMealRequest,
} from "../../models";
import { RoleService } from "../../services/role.service";
import { createError, createSlug, getUpdateOptions, paginate, removeForcedInputs, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { when } from "../../utils/when";
// import config from "../../config";

export class MealService {
  // private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async createMeal(dto: CreateMealDto, roles: string[]): Promise<Meal> {
    validateFields(dto, ["name"]);
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await MealService.checkMealExists("slug", slug)) throw createError("Meal already exist", 400);

    const _meal = await meal.create({ ...dto, slug });
    return _meal;
  }

  async createMealPack(dto: CreateMealPackDto, roles: string[]): Promise<MealPack> {
    validateFields(dto, ["name", "meals", "images", "price", "orderType", "country"]);
    if (!!dto?.price) validateFields(dto.price, ["amount", "deliveryFee"]);
    if (!!dto?.images && dto?.images?.length < 1) throw createError("At least one image is required", 400);

    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await MealService.checkMealPackExists("slug", slug)) throw createError("Meal pack already exist", 400);

    const _meal_pack = await mealPack.create({ ...dto, image_url: dto?.images[0], slug });
    return _meal_pack;
  }

  async updateMealPack(id: string, dto: Partial<CreateMealPackDto>, roles: string[]): Promise<MealPack> {
    if (!!dto?.price) validateFields(dto.price, ["amount"]);
    removeForcedInputs(dto?.price!, ["previousAmount"]);

    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.UPDATE, PermissionScope.ALL]);

    let _meal = await mealPack.findById(id).lean<MealPack>().exec();
    if (!_meal) throw createError("Meal pack does not exist", 404);

    dto.price = {
      ...dto?.price,
      previousAmount: _meal?.price?.amount ?? 0,
      deliveryFee: dto?.price?.deliveryFee ?? _meal?.price?.deliveryFee,
    } as any;


    _meal = await mealPack
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          slug: createSlug(dto?.name ?? _meal?.name),
          // product_id: product?.id ?? _meal?.product_id,
          // price_id: price?.id ?? _meal?.price_id,
          image_url: !_meal?.image_url && dto?.images ? dto?.images[0] : _meal?.image_url,
        },
        { new: true }
      )
      .lean<MealPack>()
      .exec();

    return _meal;
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

  async getMealPacks(_: string[], filters?: IPaginationFilter & { is_available: boolean, country?: string, category: string, orderType:string, tag: string}): Promise<PaginatedDocument<MealPack[]>> {
    // await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
    let queries: any = {};
  
    if (!!filters?.is_available && Boolean(filters.is_available)) {
      Object.assign(queries, { is_available: true });
    }
  
    if (filters?.country) {
      Object.assign(queries, { country: filters.country });
    }
  
    if (filters?.category) {
      Object.assign(queries, { category: filters.category});
    }
  
    if (filters?.orderType) {
      Object.assign(queries, { orderType: filters.orderType });
    }
  
    if (filters?.tag) {
      Object.assign(queries, { tag: filters.tag });
    }
  
    return await paginate("mealPack", queries, filters);
  }


  async getMealPacksAdmin(
    roles: string[],
    filters?: IPaginationFilter & { is_available: boolean }
  ): Promise<PaginatedDocument<MealPack[]>> {
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

  async requestPartyMeal(dto: RequestPartyMealDto) {
    validateFields(dto, ["address", "event_date", "event_type", "meals", "number_of_guests", "phone_number", "is_guest"]);
    if (!!dto?.address) validateFields(dto.address, ["address_", "city", "country", "postcode"]);
    if (!!dto?.is_guest) validateFields(dto, ["email", "first_name", "last_name"]);
    else validateFields(dto, ["customer"]);

    if (!!dto?.customer && !dto?.is_guest && (await customer.countDocuments({ _id: dto?.customer }).exec()) < 1)
      throw createError(`Customer does not exist`, 400);

    const request = await partyMealRequest.create({ ...dto });
    return request;
  }

  async getPartyMealRequests(
    customer_id: string,
    roles: string[],
    filters?: IPaginationFilter
  ): Promise<PaginatedDocument<PartyMealRequest[]>> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    return await paginate("partyMealRequest", { customer: customer_id }, filters); 
  }

  static async decreaseAvailableMealpackQuantities(dtos: { meal_id: string; quantity: number }[]) {
    console.log("Decreasing value", dtos);

    const to_run: ReturnType<typeof this.decreaseAvailableMealpackQuantity>[] = [];
    dtos.forEach((dto) => to_run.push(this.decreaseAvailableMealpackQuantity(dto.meal_id, dto.quantity)));
    const result = await Promise.all(to_run);
    return result;
  }

  static async validateAvailableMealpackQuantities(dtos: { meal_id: string; quantity: number }[]) {
    console.log("Validating meals", dtos);

    const to_run: ReturnType<typeof this.validateAvailableMealpackQuantity>[] = [];
    dtos.forEach((dto) => to_run.push(this.validateAvailableMealpackQuantity(dto.meal_id, dto.quantity)));
    const result = await Promise.all(to_run);
    return result;
  }

  private static async decreaseAvailableMealpackQuantity(meal_id: string, quantity: number) {
    const m = await mealPack.findById(meal_id).select(["_id", "available_quantity"]).lean<MealPack>().exec();
    if (!m || !m?.available_quantity) return null;
    if (m?.available_quantity <= 0) return null;
    return await mealPack
      .updateOne({ _id: meal_id }, { $inc: { available_quantity: quantity * -1 } })
      .lean()
      .exec();
  }

  private static async validateAvailableMealpackQuantity(meal_id: string, selected_quantity: number) {
    const m = await mealPack.findById(meal_id).select(["_id", "name", "available_quantity"]).lean<MealPack>().exec();
    if (!m || !m?.available_quantity || !m?.name) throw createError(`${m?.name} is out of stock!`);
    if (m?.available_quantity <= 0) throw createError(`${m?.name} is out of stock!`);
    if (m?.available_quantity < selected_quantity)
      throw createError(
        `There ${when(m?.available_quantity > 1, "are", "is")} only ${m?.available_quantity ?? 0} (${
          m?.name
        }) meal in stock at the moment, you selected ${selected_quantity}`
      );
    return true;
  }

  async createMealExtras(dto: CreateExtrasDto, roles: string[]): Promise<MealExtras> {
    validateFields(dto, ["name"]);
    await RoleService.hasPermission(roles, AvailableResource.MEALEXTRAS, [PermissionScope.CREATE, PermissionScope.ALL]);

    const _meal_extras = await mealextras.create({ ...dto });
    return _meal_extras;
  }

  async getMealExtras(_: string[], filters?: IPaginationFilter & { name: string}): Promise<PaginatedDocument<MealPack[]>> {
    // await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    let queries: any = {};
  
    if (filters?.name) {
      Object.assign(queries, { name: filters.name });
    }
    return await paginate("mealextras", queries, filters);
  }


  async updateMealExtras(id: string, dto: Partial<CreateExtrasDto>, roles: string[]): Promise<MealExtras> {
    await RoleService.hasPermission(roles, AvailableResource.MEALEXTRAS, [PermissionScope.UPDATE, PermissionScope.ALL]);

    let _meal = await mealextras.findById(id).lean<MealPack>().exec();
    if (!_meal) throw createError("Meal extra does not exist", 404);


    _meal = await mealextras
      .findByIdAndUpdate( id, { ...dto },)
      .lean<MealPack>()
      .exec();

    return _meal;
  }

  async deleteMealExtras(id: string, roles: string[]): Promise<MealPack> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.DELETE, PermissionScope.ALL]);

    const extras = await mealextras.findByIdAndDelete(id).lean<MealPack>().exec();
    if (!extras) throw createError("Meal extra does not exist", 400);
    return extras;
  }

}
