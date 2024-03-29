// import Stripe from "stripe";
import {
  CreateMealDto,
  CreateMealPackAnalysisData,
  CreateMealPackDto,
  IPaginationFilter,
  PaginatedDocument,
  RequestPartyMealDto,
} from "../../interfaces";
import {
  customer,
  meal,
  Meal,
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
    validateFields(dto, ["name", "meals", "images", "price"]);
    if (!!dto?.price) validateFields(dto.price, ["amount", "deliveryFee"]);
    if (!!dto?.images && dto?.images?.length < 1) throw createError("At least one image is required", 400);

    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await MealService.checkMealPackExists("slug", slug)) throw createError("Meal pack already exist", 400);

    // const amount = dto?.price?.amount + (dto?.price?.deliveryFee ?? 0.12);

    // const result = await this.stripe.products.create({
    //   name: dto.name,
    //   description: dto.description,
    //   images: dto.images,
    //   default_price_data: {
    //     currency: "gbp",
    //     unit_amount: Math.round(amount * 100),
    //   },
    // });

    // const _meal_pack = await mealPack.create({ ...dto, slug, price_id: result.default_price, product_id: result.id });
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

    // let price: Stripe.Response<Stripe.Price> | null = null;
    // let product: Stripe.Response<Stripe.Product> | null = null;
    // const amount = (dto?.price?.amount ?? _meal?.price?.amount) + (dto?.price?.deliveryFee ?? _meal?.price?.deliveryFee);

    // if (!_meal?.price_id && !_meal?.product_id) {
    //   console.log("Got to the product creation");
    //   product = await this.stripe.products.create({
    //     name: dto?.name ?? _meal?.name,
    //     description: dto?.description ?? _meal?.description,
    //     images: dto?.images ?? _meal?.images,
    //     default_price_data: {
    //       currency: "gbp",
    //       // stripe expects an integer, throws `Invalid integer` error when a floating point value is sent
    //       unit_amount: Math.round(amount * 100),
    //     },
    //   });

    //   console.log("Product", product);
    // }

    // if (!!dto?.price?.amount && dto?.price?.amount !== (_meal?.price?.amount ?? 0) && (!!_meal?.product_id || product?.id)) {
    //   price = await this.stripe.prices.create({
    //     currency: "gbp",
    //     unit_amount: Math.round(amount * 100),
    //     product: product?.id ?? _meal?.product_id,
    //   });

    //   console.log({ price, amount: amount * 100 });
    // }

    // if (!product && (!!dto?.name || !!dto?.images || (!!dto?.price?.amount && price))) {
    //   await Promise.all([
    //     this.stripe.products.update(_meal.product_id, {
    //       name: dto?.name,
    //       description: dto?.description,
    //       default_price: price?.id,
    //       images: dto?.images ?? _meal?.images,
    //     }),

    //     this.stripe.prices.update(_meal?.price_id, { active: false }),
    //   ]);
    // }

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

  async getMealPacks(_: string[], filters?: IPaginationFilter & { is_available: boolean }): Promise<PaginatedDocument<MealPack[]>> {
    // await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    let queries: any = {};
    if (!!filters?.is_available && Boolean(filters.is_available)) Object.assign(queries, { is_available: true });

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
}
