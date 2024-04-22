import { CreateLineupDto } from "../../interfaces";
import { customer, DayMeals, lineup, MealLineup, MealPack, MealPackAnalysis } from "../../models";
import { createError, validateFields } from "../../utils";
import { RoleService } from "../role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { format, getDay } from "date-fns";

import omit from "lodash/omit";
import pick from "lodash/pick";
import intersection from "lodash/intersection";
import { NourishaBus } from "../../libs";
import LineupEventListener from "../../listeners/lineup.listener";
import { DeliveryService } from "./delivery.service";

export class MealLineupService {
  async createLineup(customer_id: string, dto: CreateLineupDto, roles: string[], silent = false): Promise<MealLineup> {
    validateFields(dto, ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "delivery_date"]);
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    if ((await MealLineupService.checkLineupExists(customer_id)) && !silent)
      throw createError("Customer's weekly lineup already exist", 400);

    console.clear();
    console.log("Lineup Dto", dto);

    const _lineup = await lineup.create({ ...dto, customer: customer_id });
    await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, delivery_date: dto?.delivery_date }).exec();
    await MealLineupService.lockLineupChange(customer_id);
    // const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto);

    // console.log("Lineup Analysis", analysis);

    await NourishaBus.emit("lineup:created", { owner: customer_id, lineup: _lineup, dto });
    return _lineup;
  } 

  async updateLineup(
    customer_id: string,
    lineup_id: string,
    dto: Partial<CreateLineupDto>,
    roles: string[],
    dryRun = false
  ): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    await MealLineupService.validateLockedLineupChange(customer_id);

    console.clear();
    console.log("Lineup Dto", dto);

    const _lineup = await lineup
      .findOneAndUpdate({ _id: lineup_id, customer: customer_id }, { ...omit(dto, ["customer"]) }, { new: true })
      .lean<MealLineup>()
      .exec();
    if (!_lineup && !dryRun) throw createError("Customer's weekly lineup does not exist", 404);
    await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, delivery_date: dto?.delivery_date }).exec();
    await MealLineupService.lockLineupChange(customer_id);
    // const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto as any);

    // console.log("Lineup Analysis", analysis);

    await NourishaBus.emit("lineup:updated", { owner: customer_id, lineup: _lineup, dto: dto as any });
    return _lineup;
  }

  async getCurrentCustomersLineup(customer_id: string, roles: string[]): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((pop) => ({
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

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((pop) => ({
      path: pop,
      populate: ["breakfast", "lunch", "dinner"],
    }));

    const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);
    if (!_lineup[today]) throw createError("You've got no meal today", 404);

    return _lineup[today];
  }

  async getUpcomingLineup(customer_id: string, roles: string[]): Promise<{ day: string; data: DayMeals }[]> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const day_of_week_index = getDay(new Date());

    let _intersect = intersection(intersection(days, pops), Array.from(days).splice(day_of_week_index + 1));

    pops = pops.map((pop) => ({
      path: pop,
      populate: ["breakfast", "lunch", "dinner"],
    })) as any[];

    const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);

    const result = pick(_lineup, _intersect);
    const transform = Object.keys(result).map((key) => ({ day: key, data: result[key] }));
    return transform;
  }

  static async checkLineupExists(customer_id: string): Promise<boolean> {
    const count = await lineup.countDocuments({ customer: customer_id }).exec();
    return count > 0;
  }

  static async validateLockedLineupChange(customer_id: string): Promise<void> {
    // const acc = await customer.findById(customer_id).select(["preference"]).lean<Customer>().exec();
    // if (!acc) throw createError("Customer not found", 404);

    // const pref = acc?.preference;
    // if (!pref || (!!pref && !pref?.next_lineup_change_exp)) return;

    // if (!!pref && !!pref?.next_lineup_change_exp && Date.now() < pref?.next_lineup_change_exp)
    //   throw createError(
    //     `Changes to your lineup is locked till ${format(pref.next_lineup_change_exp, "eee DD, MMM yyyy at hh:mm aaa")}`,
    //     400
    //   );

    const result = await DeliveryService.canUpdateLineup(customer_id);
    if (!result) return;

    if (result?.is_locked && Date.now() < result.next_change_date.getTime())
      throw createError(`Changes to your lineup is locked till ${format(result.next_change_date, "eee dd, MMM yyyy, hh:mm aa")}`, 400);
  }

  static async lockLineupChange(customer_id: string, dryRun = true) {
    // const exp = setExpiration(7);
    // const update = await customer
    //   .findByIdAndUpdate(customer_id, { preference: { next_lineup_change_exp: exp, is_lineup_locked: true } })
    //   .lean<Customer>()
    //   .exec();
    // if (!update && !dryRun) throw createError("Unable to lock lineup changes", 400);
    // return;

    const info = await DeliveryService.updateNextLineupChangeDate(customer_id);
    if (!info && !dryRun) throw createError("Unable to lock lineup changes", 400);
    return;
  }

  // Admin
  async getLineupById(customer_id: string, roles: string[], silent = false): Promise<MealLineup | null> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((pop) => ({
      path: pop,
      populate: ["breakfast", "lunch", "dinner"],
    }));

    console.log("Silent", silent);

    const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
    if (!_lineup && !silent) throw createError("Customer's weekly lineup does not exist", 404);
    return _lineup ?? {};
  }

  static async createLineupAnalysis(customer_id: string, dto: CreateLineupDto) {
    const day_keys = Object.keys(dto).filter((k) => k !== "delivery_date");

    const analysis_doc: MealPackAnalysis[] = [];
    for (const day_key of day_keys) {
      const meal_types = Object.keys(dto[day_key] ?? {});
      const exist = meal_types.length > 0;
      if (!exist) break;
      for (const meal_type of meal_types) {
        const analysis_construct: MealPackAnalysis = {
          day: day_key,
          customer: customer_id,
          meal_type: meal_type as any,
          pack: dto[day_key][meal_type],
        };

        analysis_doc.push(analysis_construct);
      }
    }

    return analysis_doc;
  }

  // static async constructMealAnalysis()

  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new LineupEventListener();
  }
}
