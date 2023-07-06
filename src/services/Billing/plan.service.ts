import { Stripe } from "stripe";
import config from "../../config";
import { RoleService } from "../role.service";
import { CreatePlanDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { plan, Plan } from "../../models";
import { createError, createSlug, paginate, validateFields } from "../../utils";
import { SubscriptionInterval } from "../../models/plan";

export class PlanService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async createPlan(dto: CreatePlanDto, roles: string[]) {
    validateFields(dto, ["name", "description", "perks", "amount", "currency", "subscription_interval"]);

    const supportedIntervals = Object.values(SubscriptionInterval);
    if (!supportedIntervals.includes(dto.subscription_interval)) throw createError(`Support interval are ${supportedIntervals.join(", ")}`);
    await RoleService.hasPermission(roles, AvailableResource.PLAN, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await PlanService.checkPlanExists("slug", slug)) throw createError("Plan already exist", 400);

    const result = await this.stripe.products.create({
      name: dto.name,
      description: dto.description,
      default_price_data: {
        currency: "gbp",
        unit_amount: dto.amount * 100,
        recurring: {
          interval: dto.subscription_interval,
          interval_count: 1,
        },
      },
    });

    const _plan = await plan.create({ ...dto, slug, product_id: result.id, price_id: result.default_price });
    return _plan;
  }

  async updatePlan(id: string, dto: CreatePlanDto, roles: string[]) {
    const supportedIntervals = Object.values(SubscriptionInterval);
    if (!!dto.subscription_interval && !supportedIntervals.includes(dto.subscription_interval))
      throw createError(`Support interval are ${supportedIntervals.join(", ")}`);

    await RoleService.hasPermission(roles, AvailableResource.PLAN, [PermissionScope.UPDATE, PermissionScope.ALL]);

    let _plan = await plan.findById(id).lean<Plan>().exec();
    if (!_plan) throw createError("Plan does not exist", 404);

    let price: Stripe.Response<Stripe.Price> | null = null;
    if (!!dto?.amount && dto?.amount !== _plan?.amount) {
      [price] = await Promise.all([
        this.stripe.prices.create({
          currency: "gbp",
          unit_amount: dto.amount * 100,
          product: _plan?.product_id,
          recurring: {
            interval: dto?.subscription_interval ?? _plan.subscription_interval,
            interval_count: 1,
          },
        }),

        this.stripe.prices.update(_plan?.price_id, { active: false }),
      ]);
    }

    if (!!dto?.name || !!dto?.perks || (!!dto?.amount && price)) {
      await this.stripe.products.update(_plan.product_id, {
        name: dto?.name,
        description: dto?.perks && !!dto?.perks[0] ? dto.perks[0] : undefined,
        default_price: price?.id,
      });
    }

    _plan = await plan
      .findByIdAndUpdate(id, { ...dto, slug: createSlug(dto?.name ?? _plan.name), price_id: price?.id ?? _plan.price_id })
      .lean<Plan>()
      .exec();
    return _plan;
  }



  async getPlanById(id: string, roles: string[]): Promise<Plan> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.PLAN, [PermissionScope.ALL]);

    const _plan = await plan.findById(id).lean<Plan>().exec();
    if(!_plan) throw createError("Plan not found", 404);
    return _plan;
  }

  async getPlans(roles: string[], filters?: IPaginationFilter): Promise<PaginatedDocument<Plan[]>> {
    await RoleService.hasPermission(roles, AvailableResource.PLAN, [PermissionScope.READ, PermissionScope.ALL]);
    const queries: any = {};
    return paginate('plan', queries, filters);
  }

  async deletePlan(id: string, roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.PLAN, [PermissionScope.DELETE, PermissionScope.ALL]);

     const _plan = await plan.findByIdAndDelete(id).lean<Plan>().exec();
    if(!_plan) throw createError("Plan not found", 404);
    return _plan;
  }

  static async checkPlanExists(key: keyof Plan, value: string): Promise<boolean> {
    const count = await plan.countDocuments({ [key]: value }).exec();
    return count > 0;
  }
}
