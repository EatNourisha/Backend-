import { Stripe } from "stripe";
import config from "../../config";
import { RoleService } from "../role.service";
import { CreatePlanDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { Customer, customer, plan, Plan, Subscription } from "../../models";
import { createError, createSlug, paginate, validateFields } from "../../utils";
import { SubscriptionInterval } from "../../models/plan";
import { SubscriptionService } from "./subscription.service";
import { add } from "date-fns";
import { ScheduleQueue } from "../../queues";

export class PlanService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async createPlan(dto: CreatePlanDto, roles: string[]) {
    validateFields(dto, ["name", "description", "perks", "amount", "country", "currency", "subscription_interval"]);

    const supportedIntervals = Object.values(SubscriptionInterval);
    if (!supportedIntervals.includes(dto.subscription_interval)) throw createError(`Support interval are ${supportedIntervals.join(", ")}`);
    await RoleService.hasPermission(roles, AvailableResource.PLAN, [PermissionScope.CREATE, PermissionScope.ALL]);

    const slug = createSlug(dto.name);
    if (await PlanService.checkPlanExists("slug", slug)) throw createError("Plan already exist", 400);

    dto.country = dto.country.toLowerCase();

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
      price = await this.stripe.prices.create({
        currency: "gbp",
        unit_amount: dto.amount * 100,
        product: _plan?.product_id,
        recurring: {
          interval: dto?.subscription_interval ?? _plan.subscription_interval,
          interval_count: 1,
        },
      });
    }

    if (!!dto?.name || !!dto?.perks || (!!dto?.amount && price)) {
      await this.stripe.products.update(_plan.product_id, {
        name: dto?.name,
        description: dto?.perks && !!dto?.perks[0] ? dto.perks[0] : undefined,
        default_price: price?.id,
      });

      await this.stripe.prices.update(_plan?.price_id, { active: false });
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
    if (!_plan) throw createError("Plan not found", 404);
    return _plan;
  }

  async getPlans(roles: string[], filters?: IPaginationFilter & { searchPhrase?: string }): Promise<PaginatedDocument<Plan[]>> {
    await RoleService.hasPermission(roles, AvailableResource.PLAN, [PermissionScope.READ, PermissionScope.ALL]);
    const queries: any = {};

    if (!!filters?.searchPhrase) Object.assign(queries, { $text: { $search: filters?.searchPhrase } });
    return paginate("plan", queries, filters);
  }

  async deletePlan(id: string, roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.PLAN, [
      PermissionScope.DELETE,
      PermissionScope.ALL,
    ]);

    const _plan = await plan.findByIdAndDelete(id).lean<Plan>().exec();
    if (!_plan) throw createError("Plan not found", 404);
    return _plan;
  }

  async assignPlan(plan_id: string, dto: { customer_id: string }, roles: string[]) {
    validateFields(dto, ["customer_id"]);
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.PLAN, [
      PermissionScope.ASSIGN,
      PermissionScope.ALL,
    ]);

    const { customer_id } = dto;
    const _plan = await plan.findById(plan_id).lean<Plan>().exec();
    if (!_plan) throw createError("Plan not found", 404);

    const cus = await customer.findById(customer_id).populate("subscription").lean<Customer>().exec();
    if (!cus) throw createError("Customer not found", 404);

    const interval = `${_plan?.subscription_interval ?? "week"}s`;
    const next_sub_date = add(new Date(), { [interval]: 1 });

    const prev_sub = cus?.subscription as Subscription;

    const sub = await SubscriptionService.createSubscription(cus?.stripe_id, {
      end_date: next_sub_date,
      start_date: new Date(),
      next_billing_date: next_sub_date,
      plan: _plan?._id!,
      status: "active",
      customer: cus?._id,
      card: prev_sub?.card ?? cus?._id!,
      stripe_id: prev_sub?.stripe_id ?? undefined,
      is_assigned_by_admin: true,
      last_assigned_date: new Date(),
    });

    const delay = next_sub_date.getTime() - Date.now();
    await ScheduleQueue.add("update_subscription_cron", { id: sub?._id!, status: "expired" }, { delay });
    // console.log("Job", job);

    return sub;
  }

  static async checkPlanExists(key: keyof Plan, value: string): Promise<boolean> {
    const count = await plan.countDocuments({ [key]: value }).exec();
    return count > 0;
  }
}
