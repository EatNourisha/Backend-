import { CreateLineupDto } from "../../interfaces";
import { customer, DayMeals, lineup, MealLineup, mealPack, MealPack, MealPackAnalysis, subscription } from "../../models";
import { createError, validateFields } from "../../utils";
import { RoleService } from "../role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { getDay } from "date-fns";

import omit from "lodash/omit";
import pick from "lodash/pick";
import intersection from "lodash/intersection";
import { NourishaBus } from "../../libs";
import LineupEventListener from "../../listeners/lineup.listener";
import { DeliveryService } from "./delivery.service";
import { MealService } from "./meal.service";

export class MealLineupService {
  async createLineup(customer_id: string, dto: CreateLineupDto, roles: string[]): Promise<MealLineup> {
    
    // Validate fields
    if(dto?.in_week === false || null){
      validateFields(dto, ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "delivery_date"]);
    }

    if(dto?.in_week === true){
      validateFields(dto, ["monday", "tuesday", "wednesday", "thursday", "friday", "delivery_date"]);
    }

    // Check permissions
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    // Retrieve customer's subscription information
    const subscriptionCheck = await subscription.findOne({ customer: customer_id });
    const endDate = subscriptionCheck?.end_date; 
    
  // If the subscription is active and has start and end dates
    if (subscriptionCheck?.status === "active" && subscriptionCheck?.start_date && subscriptionCheck.end_date) {
        const startDate = new Date(subscriptionCheck.start_date).getTime(); 
        const endDate = new Date(subscriptionCheck.end_date).getTime(); 
        
        // Calculate subscription duration in days
        const subDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Check if subscription duration is exactly 7 days
        if (subDuration === 7 && dto.week > 1) {
            throw createError("Only monthly subscribers can create more than one lineup", 404);
        }
    }

    // Extract all mealIds from the DTO
    const mealIds = [
    dto?.monday?.lunch?.mealId, dto?.monday?.dinner?.mealId,
    dto?.tuesday?.lunch?.mealId, dto?.tuesday?.dinner?.mealId,
    dto?.wednesday?.lunch?.mealId, dto?.wednesday?.dinner?.mealId,
    dto?.thursday?.lunch?.mealId, dto?.thursday?.dinner?.mealId,
    dto?.friday?.lunch?.mealId, dto?.friday?.dinner?.mealId,
    dto?.saturday?.lunch?.mealId, dto?.saturday?.dinner?.mealId,
    dto?.sunday?.lunch?.mealId, dto?.sunday?.dinner?.mealId
    ].filter(mealId => mealId != null); // Filter out null or undefined mealIds

    // Update available_quantity for each selected mealId
    for (const mealId of mealIds) {
    const _mealPack = await mealPack.findById(mealId).exec();
    if (_mealPack && _mealPack.available_quantity !== undefined) {
        _mealPack.available_quantity -= 1;
        await _mealPack.save(); // Save the updated meal pack
    } 
    }    
    
    const cusLineup = await lineup.findOne({customer: customer_id, week: dto?.week || 1, status: "active"})

    // Check if the customer lineup for the specified week already exists
    if(cusLineup) throw createError('Customer lineup for this week already exists', 404);

    // If all validations pass, create the lineup
    const _lineup = await lineup.create({ ...dto, customer: customer_id, sub_end_date: endDate, week: dto?.week ||1 , plan: subscriptionCheck?.plan});
    await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, delivery_date: dto?.delivery_date}).exec();
    await MealLineupService.lockLineupChange(customer_id);

    // Emit event
    await NourishaBus.emit("lineup:created", { owner: customer_id, lineup: _lineup, dto });

    return _lineup;
}

  async updateSwallow(customer_id: string, lineup_id: string, roles: string[], dto:CreateLineupDto): Promise<MealLineup> {
    
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.UPDATE, PermissionScope.ALL]);

    const _swallow = await lineup
    .findOneAndUpdate({ _id: lineup_id, customer: customer_id }, { swallow: dto?.swallow })
    .lean<MealLineup>()
    .exec();

    return _swallow;
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

  // async getCurrentCustomersLineup(customer_id: string, roles: string[]): Promise<MealLineup> {
  //   await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

  //   const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((pop) => ({
  //     path: pop,
  //     populate: ["breakfast", "lunch", "dinner"],
  //   }));

  //   const _lineup = await lineup.findOne({ customer: customer_id }).populate(pops).lean<MealLineup>().exec();
  //   if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);
  //   return _lineup;
  // }  

  async getCurrentCustomersLineup(customer_id: string, roles: string[], week: number | undefined): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
    }));
  
    const _lineup = await lineup.findOne({ customer: customer_id, week: week || 1 })
    .populate(pops)
    .sort({ createdAt: -1 })
    .lean<MealLineup>()
    .exec();    
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);
    return _lineup;
  }

  async getTodaysLineup(customer_id: string, roles: string[]): Promise<MealPack> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day_of_week_index = getDay(new Date());
    const today = days[day_of_week_index];

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
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
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
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

    // if (result?.is_locked && Date.now() < result.next_change_date.getTime())
    //   throw createError(`Changes to your lineup is locked till ${format(result.next_change_date, "eee dd, MMM yyyy, hh:mm aa")}`, 400);
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

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
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

  static async decreaseAvailableMealpackQuantities(dto: CreateLineupDto) {
    const day_keys = Object.keys(dto).filter((k) => !["delivery_date", "customer"].includes(k));
    const mealpacks_and_quantities: { meal_id: string; quantity: number }[] = [];

    for (const day_key of day_keys) {
      const meal_types = Object.keys(dto[day_key] ?? {});
      if (meal_types.length < 3) continue;
      for (const meal_type of meal_types) {
        const actual_meal_id = (dto[day_key] ?? {})[meal_type];
        if (!Object.prototype.hasOwnProperty.call(dto[day_key], meal_type)) continue;
        mealpacks_and_quantities.push({
          meal_id: actual_meal_id,
          quantity: 1,
        });
      }
    }

    // console.log("mealpacks_and_quantities", mealpacks_and_quantities);

    if (mealpacks_and_quantities.length < 1) return;
    return await MealService.decreaseAvailableMealpackQuantities(mealpacks_and_quantities);
  }

  async getLineupByLineupId(lineupId: string, roles: string[], silent = false): Promise<MealLineup | null> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
    }));

    console.log("Silent", silent);

    const _lineup = await lineup.findOne({ _id: lineupId }).populate(pops).populate('plan').sort({ createdAt: -1 }).lean<MealLineup>().exec();
    if (!_lineup && !silent) throw createError("Customer's weekly lineup does not exist", 404);
    return _lineup ?? {};
  }

  // async getLineups(
  //   roles: string[], 
  //   silent = false, 
  //   status?: string, 
  //   week?: string, 
  //   limit?: number, 
  //   page?: number
  // ): Promise<MealLineup | null> {
  //   await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
  //     PermissionScope.READ,
  //     PermissionScope.ALL,
  //   ]);
  
  //   const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
  //     path: day,
  //     populate: [
  //       { path: 'breakfast.mealId' },
  //       { path: 'breakfast.extraId' },
  //       { path: 'lunch.mealId' },
  //       { path: 'lunch.extraId' },
  //       { path: 'dinner.mealId' },
  //       { path: 'dinner.extraId' },
  //     ],
  //   }));
  
  //   const filter: any = {};
  //   if (status) filter.status = status;
  //   if (week) filter.week = week;
  
  //   // Defaulting limit and page if they aren't provided
  //   const effectiveLimit = limit ?? 10;
  //   const effectivePage = page ?? 1;
  
  //   const _lineup = await lineup.find(filter)
  //     .populate(pops)
  //     .sort({ createdAt: -1 })
  //     .limit(effectiveLimit)
  //     .skip((effectivePage - 1) * effectiveLimit)
  //     .lean<MealLineup>()
  //     .exec();
  
  //   if (!_lineup && !silent) throw createError("No lineups", 404);
  //   return _lineup ?? [];
  // }

  async getLineups(
    roles: string[], 
    silent = false, 
    status?: string, 
    week?: string, 
    limit?: number, 
    page?: number
  ): Promise<{ totalCount: number, lineups: MealLineup[] }> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);
  
    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
    }));
  
    const filter: any = {};
    if (status) filter.status = status;
    if (week) filter.week = week;
  
    // Count total documents matching the filter
    const totalCount = await lineup.countDocuments(filter);
  
    // Defaulting limit and page if they aren't provided
    const effectiveLimit = limit ?? 10;
    const effectivePage = page ?? 1;
  
    const lineups = await lineup.find(filter)
      .populate(pops)
      .sort({ createdAt: -1 })
      .limit(effectiveLimit)
      .skip((effectivePage - 1) * effectiveLimit)
      .lean<MealLineup[]>()
      .exec();
  
    if (!lineups.length && !silent) throw createError("No lineups", 404);
  
    return { totalCount, lineups } ?? [];
  }

  async importPreviousLineup(customer_id: string, roles: string[]): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
    }));
  
    // Find the most recently created meal lineup by the customer
    const lastLineup = await lineup
      .findOne({ customer: customer_id })
      .sort({ createdAt: -1 }) 
      .populate(pops)
      .lean<MealLineup>()
      .exec();
  
    if (!lastLineup) throw createError("Customer has no meal lineups", 404);
  
    return lastLineup;
  }
  
  
  async importPreviousLineupById(
    customer_id: string, 
    id: string, 
    roles: string[]
  ): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' }
      ]
    })) 
  
    const lastLineup = await lineup
      .findOne({ _id: id, customer: customer_id })
      .populate(pops)
      .lean<MealLineup>()
      .exec();
  
    if (!lastLineup) throw createError("Customer has no meal lineups", 404);
  
    return lastLineup;
  }
  
  async customerPreviousLineups(customer_id: string, roles: string[]): Promise<MealLineup> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
    const pops = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
      path: day,
      populate: [
        { path: 'breakfast.mealId' },
        { path: 'breakfast.extraId' },
        { path: 'lunch.mealId' },
        { path: 'lunch.extraId' },
        { path: 'dinner.mealId' },
        { path: 'dinner.extraId' },
      ],
    }));

  
    // Find the most recently created meal lineup by the customer
    const lastLineup = await lineup
      .find({ customer: customer_id })
      .sort({ createdAt: -1 }) 
      .populate(pops)
      .populate('plan')
      .lean<MealLineup>()
      .exec();
  
    if (!lastLineup) throw createError("Customer has no meal lineups", 404);
  
    return lastLineup;
  }
   
  // static async constructMealAnalysis()

  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new LineupEventListener();
  }
}
