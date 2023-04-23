import { CreateLineupDto } from "../../interfaces";
import { customer, lineup, MealLineup, MealPack } from "../../models";
import { createError, validateFields } from "../../utils";
import { RoleService } from "../role.service";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { getDay } from "date-fns";

import omit from "lodash/omit";
import pick from "lodash/pick";
import intersection from "lodash/intersection";

export class MealLineupService {
  async createLineup(customer_id: string, dto: CreateLineupDto, roles: string[]): Promise<MealLineup> {
    validateFields(dto, ["monday", "tuesday", "wednesday", "thursday", "friday"]);
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    if (await MealLineupService.checkLineupExists(customer_id)) throw createError("Customer's weekly lineup already exist", 400);

    const _lineup = await lineup.create({ ...dto, customer: customer_id });
    await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id }).exec();
    return _lineup;
  }

  async updateLineup(lineup_id: string, dto: Partial<CreateLineupDto>, roles: string[], dryRun = false): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const _lineup = await lineup
      .findByIdAndUpdate(lineup_id, { ...omit(dto, ["customer"]) }, { new: true })
      .lean<MealLineup>()
      .exec();
    if (!_lineup && !dryRun) throw createError("Customer's weekly lineup does not exist", 404);
    return _lineup;
  }

  async getCurrentCustomersLineup(customer_id: string, roles: string[]): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday"].map((pop) => ({
      path: pop,
      populate: ["breakfast", "lunch", "dinner"],
    }));

    const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);
    return _lineup;
  }

  async getTodaysLineup(customer_id: string, roles: string[]): Promise<MealPack> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day_of_week_index = getDay(new Date());
    const today = days[day_of_week_index];

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);
    if (!_lineup[today]) throw createError("You've got no meal today", 404);

    return _lineup[today];
  }

  async getUpcomingLineup(customer_id: string, roles: string[]): Promise<Record<string, MealPack>> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let pops = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const day_of_week_index = getDay(new Date());
    let _intersect = intersection(intersection(days, pops), Array.from(days).splice(day_of_week_index + 1));
    pops = pops.map((pop) => ({
      path: pop,
      populate: ["breakfast", "lunch", "dinner"],
    })) as any[];
    const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);

    return pick(_lineup, _intersect) as any;
  }

  static async checkLineupExists(customer_id: string): Promise<boolean> {
    const count = await lineup.countDocuments({ customer: customer_id }).exec();
    return count > 0;
  }
}
