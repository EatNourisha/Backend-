import { createError } from "../../utils";
import { FoodBoxDto } from "../../interfaces";
import { adminSettings, customer, foodbox, FoodBox, mealPack, order, promoCode, subscription, transaction, MealPackAnalysis, csteam } from "../../models";
import { RoleService } from "../role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { AmbassadorEmail, HeroEmail, InsiderEmail, loyaltyreward, NoviceEmail, OGEmail, RichEmail, SpecialEmail, UpgradedEmail } from "../Marketing/bluePrint.service";
import { NourishaBus } from "../../libs";
import { sendOrderAlert } from "../Marketing/marketing.service";
import { DeliveryService } from "./delivery.service";
import { MealService } from "./meal.service";
import omit from "lodash/omit";



export class FoodBoxService {
  async createFoodBox(customer_id: string, dto: FoodBoxDto, roles: string[]): Promise<FoodBox> {
      
      await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
      const subscriptionCheck = await subscription.findOne({ customer: customer_id });
      const endDate = subscriptionCheck?.end_date;
      
      let deli_date: Date | undefined = dto.delivery_date;
      if (subscriptionCheck?.status === "active" && subscriptionCheck?.start_date && subscriptionCheck.end_date) {
  
        if (subscriptionCheck?.continent === "Asian" || subscriptionCheck?.continent === "Asia") {
          const asianDels = await adminSettings.findOne();
  
          const currentDay = new Date().getDay();
  
          // Orders placed Wednesday to Saturday will be delivered next Tuesday
          if (currentDay >= 3 && currentDay <= 6) {
            deli_date = asianDels?.wed_sat;
          }
  
          // Orders placed on Sunday to Tuesday are delivered the following Tuesday
          else {
            deli_date = asianDels?.sun_tue;
          }
        }
        const startDate = new Date(subscriptionCheck.start_date).getTime();
        const endDate = new Date(subscriptionCheck.end_date).getTime();
  
        const subDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
        if (subDuration === 7 && dto.week > 1) {
          throw createError("Only monthly subscribers can create more than one lineup", 404);
        }
      }    
  
  
      if (dto?.selections && dto.selections.length > 0) {
        for (const selection of dto.selections) {
          const { mealId, quantity } = selection;

          if (!mealId) {
            console.error("Invalid mealId in selections.");
            continue;
          }

          const _mealPack = await mealPack.findById(mealId).exec();

          if (!_mealPack) {
            console.error(`Meal pack with ID ${mealId} not found.`);
            continue;
          }

          if (_mealPack.available_quantity !== undefined) {
            if (quantity > _mealPack.available_quantity) {
              throw createError(
                `${_mealPack.name} is selected more than the available quantity. Please select up to ${_mealPack.available_quantity} only.`,
                400
              );
            }

            _mealPack.available_quantity = Math.max(0, _mealPack.available_quantity - quantity);
            await _mealPack.save();

            if (_mealPack.available_quantity === 0) {
              _mealPack.is_available = false;
              await _mealPack.save();
            }
          }
        }
      } else {
        console.error("No selections provided.");
      }

      
      const orderExists = await order.exists({ customer: customer_id, status: "payment_received", delivery_date: { $lte: new Date() } });
      const lineupExists = await foodbox.exists({ customer: customer_id });
  
      let returning = false;
  
      if (orderExists || lineupExists) {
        returning = true;
      }
  
      //****************************************************** */
      // This is to handle the 5th time order customer coupon code
      // This is to handle the 5th time order customer coupon code
      //****************************************************** */
      const _cusLineup = await foodbox.findOne({ customer: customer_id }).sort({ createdAt: -1 });
      const customerData = await customer.findById(customer_id);
      const now = new Date();
  
      const daysSinceReset = Math.ceil((now.getTime() - new Date(customerData!.lastLineupReset).getTime()) / (1000 * 60 * 60 * 24));
      const lastLineupDate = _cusLineup?.createdAt ?? new Date();
      const LastLineup = Math.ceil((now.getTime() - lastLineupDate!.getTime()) / (1000 * 60 * 60 * 24));
  
      
  
      if(daysSinceReset <= 30){
        if (customerData && customerData.lineupCount === 3) {
          await loyaltyreward(customerData?.email!, {customer: customerData?._id})
            } 
        if (customerData && customerData.lineupCount === 4) {
          // await loyaltyreward(customerData?.email!, {customer: customerData?._id})
      
          if(customerData!.level === 'Newbie' || customerData!.level === null){
            
            customerData!.level ='Novice'
            await customerData?.save()
            await NoviceEmail(customerData?.email!, {customer: customerData?._id})
          }else
          if(customerData!.level === 'Novice'){
            customerData!.level ='OG'
            await customerData?.save()
            await OGEmail(customerData?.email!, {customer: customerData?._id})
          }else
      
          if(customerData!.level === 'OG'){
            customerData!.level ='Upgraded'
            await customerData?.save()
            await UpgradedEmail(customerData?.email!, {customer: customerData?._id})
          }
          if(customerData!.level === 'Upgraded'){
            customerData!.level ='Rich'
            await customerData?.save()
            await RichEmail(customerData?.email!, {customer: customerData?._id})
          }else
          if(customerData!.level === 'Rich'){
            customerData!.level ='Insider'
            await customerData?.save()
            await InsiderEmail(customerData?.email!, {customer: customerData?._id})
          }else
          if(customerData!.level === 'Insider'){
            customerData!.level ='Special'
            await customerData?.save()
            await SpecialEmail(customerData?.email!, {customer: customerData?._id})
          }
          if(customerData!.level === 'Special'){
            customerData!.level ='Hero'
            await customerData?.save()
            await HeroEmail(customerData?.email!, {customer: customerData?._id})
      
          }else
          if(customerData!.level === 'Hero'){
            customerData!.level ='Ambassador'
            await customerData?.save()
            await AmbassadorEmail(customerData?.email!, {customer: customerData?._id})
          }
          await customerData?.save()
      
        } 
        
        if(customerData && customerData!.lineupCount === 4){
          customerData.lineupCount = 0;
          customerData.lastLineupReset = now;
          await customerData!.save();
    
      }  else if(customerData && customerData.lineupCount <= 3){
          customerData.lineupCount +=1;
          await customerData!.save();
        }
        else{
          console.log('conditions skipped')
        }
  
      } 
      
      if(daysSinceReset > 30){
        if(LastLineup <= 7 && customerData!.lineupCount === 4){
          if (customerData){
            customerData.lineupCount = 0;
            customerData.lastLineupReset = now;
  
          }
          await customerData!.save();
        }else{
          if (customerData){
  
          customerData.lineupCount =1;
          customerData.lastLineupReset = now;
          await customerData!.save();
          }
  
        }
      }
  
      const trans = await transaction.findOne({customer: customer_id, status: 'successful'}).sort({createdAt: -1})
  
      const promo = await promoCode.findById(trans?.applied_promo)
  
      const _lineup = await foodbox.create({
        ...dto,
        customer: customer_id,
        sub_end_date: endDate,
        week: dto?.week || 1,
        plan: subscriptionCheck?.plan,
        isReturningCustomer: returning,
        coupon_applied: promo?.code.toLocaleUpperCase(),
        platform: dto?.platform ?? 'mobile'
      });
  
      if(customerData){
        customerData.activeLineup = true
        customerData.emailUpdated = false
        await customerData.save()
      }
      _lineup.delivery_date = deli_date ?? new Date();
      await _lineup.save()
      await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, 
        delivery_date: deli_date }).exec();
  
        const __sub = await subscription.findOne({ customer: customer_id });
        if (__sub) {
          __sub.status = 'inactive';
          __sub.used_sub = true;
          await __sub.save();
        }
  
      await FoodBoxService.lockLineupChange(customer_id);
  
      // Emit event
      await NourishaBus.emit("foodbox:created", { owner: customer_id, lineup: _lineup, dto });
  
      const emails = [
        'Victorianourisha@gmail.com',
        'nourishaorders@gmail.com',
        'shukazuby@gmail.com',
  
      ]
  
      const payload = {
        deliveryDate: _lineup.delivery_date,
        subject: ` New Order: Lineup Added by ${customerData?.first_name} ${customerData?.last_name}`,
        customer: customerData?._id
  
      }
  
      await sendOrderAlert( emails, payload)
  
      console.log('Kitchen Email Sent to Admins - Mobile Email', ` Lineup Added by ${customerData?.first_name} ${customerData?.last_name}`)
      return _lineup;
    }

  async createFoodBoxWeb(customer_id: string, dto: FoodBoxDto, roles: string[]): Promise<FoodBox> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);

    const subscriptionCheck = await subscription.findOne({ customer: customer_id });
    const endDate = subscriptionCheck?.end_date;

    
    let deli_date: Date | undefined = dto.delivery_date;
    if (subscriptionCheck?.status === "active" && subscriptionCheck?.start_date && subscriptionCheck.end_date) {

      if (subscriptionCheck?.continent === "Asian" || subscriptionCheck?.continent === "Asia") {
        const asianDels = await adminSettings.findOne();

        const currentDay = new Date().getDay();

        if (currentDay >= 3 && currentDay <= 6) {
          deli_date = asianDels?.wed_sat;
        }

        else {
          deli_date = asianDels?.sun_tue;
        }
      }
    }
    
    if (dto?.selections && dto.selections.length > 0) {
      for (const selection of dto.selections) {
        const { mealId, quantity } = selection;

        if (!mealId) {
          console.error("Invalid mealId in selections.");
          continue;
        }

        const _mealPack = await mealPack.findById(mealId).exec();

        if (!_mealPack) {
          console.error(`Meal pack with ID ${mealId} not found.`);
          continue;
        }

        if (_mealPack.available_quantity !== undefined) {
          if (quantity > _mealPack.available_quantity) {
            throw createError(
              `${_mealPack.name} is selected more than the available quantity. Please select up to ${_mealPack.available_quantity} only.`,
              400
            );
          }

          _mealPack.available_quantity = Math.max(0, _mealPack.available_quantity - quantity);
          await _mealPack.save();

          if (_mealPack.available_quantity === 0) {
            _mealPack.is_available = false;
            await _mealPack.save();
          }
        }
      }
    } else {
      console.error("No selections provided.");
    }
  
    const orderExists = await order.exists({ customer: customer_id, status: "payment_received", delivery_date: { $lte: new Date() } });
    const lineupExists = await foodbox.exists({ customer: customer_id });

    let returning = false;

    if (orderExists || lineupExists) {
      returning = true;
    }

    //****************************************************** */
    // This is to handle the 5th time order customer coupon code
    // This is to handle the 5th time order customer coupon code
    //****************************************************** */
    const _cusLineup = await foodbox.findOne({ customer: customer_id }).sort({ createdAt: -1 });
    const customerData = await customer.findById(customer_id);
    const now = new Date();

    const daysSinceReset = Math.ceil((now.getTime() - new Date(customerData!.lastLineupReset).getTime()) / (1000 * 60 * 60 * 24));
    const lastLineupDate = _cusLineup?.createdAt ?? new Date();

    const LastLineup = Math.ceil((now.getTime() - lastLineupDate!.getTime()) / (1000 * 60 * 60 * 24));
    
    if(daysSinceReset <= 30){
      if (customerData && customerData.lineupCount === 3) {
        await loyaltyreward(customerData?.email!, {customer: customerData?._id})    
      } 
      
      if (customerData && customerData.lineupCount === 4) {
        // await loyaltyreward(customerData?.email!, {customer: customerData?._id})
    
        if(customerData!.level === 'Newbie' || customerData!.level === null){
          
          customerData!.level ='Novice'
          await customerData?.save()
          await NoviceEmail(customerData?.email!, {customer: customerData?._id})
        }else
        if(customerData!.level === 'Novice'){
          customerData!.level ='OG'
          await customerData?.save()
          await OGEmail(customerData?.email!, {customer: customerData?._id})
        }else
    
        if(customerData!.level === 'OG'){
          customerData!.level ='Upgraded'
          await customerData?.save()
          await UpgradedEmail(customerData?.email!, {customer: customerData?._id})
        }
        if(customerData!.level === 'Upgraded'){
          customerData!.level ='Rich'
          await customerData?.save()
          await RichEmail(customerData?.email!, {customer: customerData?._id})
        }else
        if(customerData!.level === 'Rich'){
          customerData!.level ='Insider'
          await customerData?.save()
          await InsiderEmail(customerData?.email!, {customer: customerData?._id})
        }else
        if(customerData!.level === 'Insider'){
          customerData!.level ='Special'
          await customerData?.save()
          await SpecialEmail(customerData?.email!, {customer: customerData?._id})
        }
        if(customerData!.level === 'Special'){
          customerData!.level ='Hero'
          await customerData?.save()
          await HeroEmail(customerData?.email!, {customer: customerData?._id})
    
        }else
        if(customerData!.level === 'Hero'){
          customerData!.level ='Ambassador'
          await customerData?.save()
          await AmbassadorEmail(customerData?.email!, {customer: customerData?._id})
        }
        await customerData?.save()
    
      } 
      
      if(customerData && customerData!.lineupCount === 4){
        customerData.lineupCount = 0;
        customerData.lastLineupReset = now;
        await customerData!.save();
  
    }  else if(customerData && customerData.lineupCount <= 3){
        customerData.lineupCount +=1;
        await customerData!.save();
      }
      else{
        console.log('conditions skipped')
      }

    } 
    
    if(daysSinceReset > 30){
      if(LastLineup <= 7 && customerData!.lineupCount === 4){
        if (customerData){
          customerData.lineupCount = 0;
          customerData.lastLineupReset = now;

        }
        await customerData!.save();
      }else{
        if (customerData){

        customerData.lineupCount =1;
        customerData.lastLineupReset = now;
        await customerData!.save();
        }

      }
    }

    const trans = await transaction.findOne({customer: customer_id, status: 'successful'}).sort({createdAt: -1})

    const promo = await promoCode.findById(trans?.applied_promo)

    const _lineup = await foodbox.create({
      ...dto,
      customer: customer_id,
      sub_end_date: endDate,
      week: dto?.week || 1,
      plan: subscriptionCheck?.plan,
      isReturningCustomer: returning,
      coupon_applied: promo?.code.toLocaleUpperCase(),
      platform: dto?.platform ?? 'web'
    });

    if(customerData){
      customerData.activeLineup = true
      customerData.emailUpdated = false
      await customerData.save()
    }

    _lineup.delivery_date = deli_date ?? new Date();
    await _lineup.save()
    await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, 
      delivery_date: deli_date }).exec();

      const __sub = await subscription.findOne({ customer: customer_id });
      if (__sub) {
        __sub.status = 'inactive';
        __sub.used_sub = true;
        await __sub.save();
      }
  await FoodBoxService.lockLineupChange(customer_id);

    // Emit event
    await NourishaBus.emit("foodbox:created", { owner: customer_id, lineup: _lineup, dto });
    const emails = [
      'Victorianourisha@gmail.com',
      'nourishaorders@gmail.com',
      'shukazuby@gmail.com',

    ]

  const payload = {
      deliveryDate: _lineup.delivery_date,
      subject: ` New Order: Lineup Added by ${customerData?.first_name} ${customerData?.last_name}`,
      customer: customerData?._id
    }

    await sendOrderAlert( emails, payload)

    console.log('Kitchen Email Sent to Admins - Web Email', ` Lineup Added by ${customerData?.first_name} ${customerData?.last_name}`)


    return _lineup;
  }
    
  async getCurrentCustomersFoodBox(customer_id: string, roles: string[], week: number | undefined): Promise<FoodBox> {
    await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
  
    const pops = ["selections"].map((select) => ({
      path: select,
      populate: [
        { path: 'mealId' },
      ],
    }));
  
    const _lineup = await foodbox.findOne({ customer: customer_id, week: week || 1 })
    .populate(pops)
    .sort({ createdAt: -1 })
    .lean<FoodBox>()
    .exec();    
    if (!_lineup) throw createError("Customer's weekly lineup does not exist", 404);
    return _lineup;
  }

    // Admin
    async getFoodBoxById(customer_id: string, roles: string[], silent = false): Promise<FoodBox | null> {
      await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
        PermissionScope.READ,
        PermissionScope.ALL,
      ]);
  
      const pops = ["selections"].map((select) => ({
        path: select,
        populate: [
          { path: 'mealId' },
        ],
      }));
        console.log("Silent", silent);
  
      const _lineup = await foodbox.findOne({ customer: customer_id })
      .populate(pops)
      .populate(['customer', 'createdBy', 'editedBy'])
      .sort({createdAt: -1})
      .lean<FoodBox>().exec();
      if (!_lineup && !silent) throw createError("Customer's weekly lineup does not exist", 404);
      return _lineup ?? {};
    }
  
    static async createLineupAnalysis(customer_id: string, dto: FoodBoxDto) {
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
  
    static async decreaseAvailableMealpackQuantities(dto: FoodBoxDto) {
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
  
    async getFoodBoxByFoodBoxId(lineupId: string, roles: string[], silent = false): Promise<FoodBox | null> {
      await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
        PermissionScope.READ,
        PermissionScope.ALL,
      ]);
  
      const pops = ["selections"].map((select) => ({
        path: select,
        populate: [
          { path: 'mealId' },
        ],
      }));
    
      console.log("Silent", silent);
  
      const _lineup = await foodbox.findOne({ _id: lineupId }).populate(pops).populate(['plan', 'createdBy', 'editedBy']).sort({ createdAt: -1 }).lean<FoodBox>().exec();
      if (!_lineup && !silent) throw createError("Customer's weekly lineup does not exist", 404);
      return _lineup ?? {};
    }
  
    async getFoodBoxes(
      roles: string[], 
      silent = false, 
      status?: string, 
      week?: string, 
      limit?: number, 
      page?: number
    ): Promise<{ totalCount: number, lineups: FoodBox[] }> {
      await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
        PermissionScope.READ,
        PermissionScope.ALL,
      ]);
    
      const pops = ["selections"].map((select) => ({
        path: select,
        populate: [
          { path: 'mealId' },
        ],
      }));
      
      const filter: any = {};
      if (status) filter.status = status;
      if (week) filter.week = week;
    
      const totalCount = await foodbox.countDocuments(filter);
    
      const effectiveLimit = limit ?? 10;
      const effectivePage = page ?? 1;
    
      const lineups = await foodbox.find(filter)
        .populate(pops)
        .sort({ createdAt: -1 })
        .limit(effectiveLimit)
        .skip((effectivePage - 1) * effectiveLimit)
        .lean<FoodBox[]>()
        .exec();
    
      if (!lineups.length && !silent) throw createError("No lineups", 404);
    
      return { totalCount, lineups };
      // return { totalCount, lineups } ?? [];
    }
  
    async importPreviousLineup(customer_id: string, roles: string[]): Promise<FoodBox> {
      await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    
      const pops = [
        {
          path: "selections",
          populate: [{ path: "mealId" }],
        },
      ];
    
      const lastLineup = await foodbox
        .findOne({ customer: customer_id })
        .sort({ createdAt: -1 })
        .populate(pops)
        .lean<FoodBox>()
        .exec();
    
      if (!lastLineup) throw createError("Customer has no meal lineups", 404);
    
      const mealUsage: Record<string, number> = {};
    
      const filteredLineup: FoodBox = { ...lastLineup, selections: [] };
    
      if (lastLineup.selections) {
        for (const selection of lastLineup.selections) {
          const { mealId, quantity } = selection;
    
          if (!mealId) {
            continue; 
          }
          const meal = await mealPack.findById(mealId).lean().exec();
    
          if (!meal || meal.available_quantity === 0) {
            continue;
          }
    
          mealUsage[mealId.toString()] = (mealUsage[mealId.toString()] || 0) + quantity;
    
          if (mealUsage[mealId.toString()] > meal.available_quantity) {
            continue;
          }
    
          filteredLineup.selections?.push(selection);
        }
      }
    
      return filteredLineup;
    }
    
    async importPreviousLineupById(
      customer_id: string,
      id: string,
      roles: string[]
    ): Promise<FoodBox> {
      await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    
      const pops = [
        {
          path: "selections",
          populate: [{ path: "mealId" }],
        },
      ];
    
      const lastLineup = await foodbox
        .findOne({ _id: id, customer: customer_id })
        .populate(pops)
        .lean<FoodBox>()
        .exec();
    
      if (!lastLineup) throw createError("Customer has no meal lineups", 404);
    
      return lastLineup;
    }
    

    async customerPreviousLineups(customer_id: string, roles: string[]): Promise<FoodBox> {
      await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    
      const pops = [
        {
          path: "selections",
          populate: [{ path: "mealId" }],
        },
      ];
      
      // Find the most recently created meal lineup by the customer
      const lastLineup = await foodbox
        .find({ customer: customer_id })
        .sort({ createdAt: -1 }) 
        .populate(pops)
        .populate('plan')
        .lean<FoodBox>()
        .exec();
    
      if (!lastLineup) throw createError("Customer has no meal lineups", 404);
    
      return lastLineup;
    }
  
    async getAsianDelivery() {  
    
        let deli_date = new Date(); 
    
          const asianDels = await adminSettings.findOne();
    
          const currentDay = new Date().getDay();
    
          if (currentDay >= 3 && currentDay <= 6) {
            deli_date = asianDels?.wed_sat!;
          } else {
            deli_date = asianDels?.sun_tue!;
          }
        return deli_date 
    }
  
    async adminCreateFoodBox(adminId: string, customer_id: string, dto: FoodBoxDto, roles: string[]): Promise<FoodBox> {
      await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
        PermissionScope.READ,
        PermissionScope.ALL,
      ]);
      const admin = await customer.findById(adminId)
      const cs = await csteam.findOne({team_member: admin?._id})
      if(!cs){
          throw createError(
            ` You can't create this lineup. Not a CS Member`,
            400
          );
  }
  
      let deli_date: Date | undefined = dto.delivery_date;
  
      if (dto?.selections && dto.selections.length > 0) {
        for (const selection of dto.selections) {
          const { mealId, quantity } = selection;
  
          if (!mealId) {
            console.error("Invalid mealId in selections.");
            continue;
          }
  
          const _mealPack = await mealPack.findById(mealId).exec();
  
          if (!_mealPack) {
            console.error(`Meal pack with ID ${mealId} not found.`);
            continue;
          }
  
          if (_mealPack.available_quantity !== undefined) {
            if (quantity > _mealPack.available_quantity) {
              throw createError(
                `${_mealPack.name} is selected more than the available quantity. Please select up to ${_mealPack.available_quantity} only.`,
                400
              );
            }
  
            _mealPack.available_quantity = Math.max(0, _mealPack.available_quantity - quantity);
            await _mealPack.save();
  
            if (_mealPack.available_quantity === 0) {
              _mealPack.is_available = false;
              await _mealPack.save();
            }
          }
        }
      } else {
        console.error("No selections provided.");
      }
  
      const orderExists = await order.exists({ customer: customer_id, status: "payment_received", delivery_date: { $lte: new Date() } });
      const lineupExists = await foodbox.exists({ customer: customer_id });
  
      let returning = false;
  
      if (orderExists || lineupExists) {
        returning = true;
      }
  
      //****************************************************** */
      // This is to handle the 5th time order customer coupon code
      // This is to handle the 5th time order customer coupon code
      //****************************************************** */
      const _cusLineup = await foodbox.findOne({ customer: customer_id }).sort({ createdAt: -1 });
      const customerData = await customer.findById(customer_id);
      const now = new Date();
  
      const daysSinceReset = Math.ceil((now.getTime() - new Date(customerData!.lastLineupReset).getTime()) / (1000 * 60 * 60 * 24));
      const lastLineupDate = _cusLineup?.createdAt ?? new Date();
  
      const LastLineup = Math.ceil((now.getTime() - lastLineupDate!.getTime()) / (1000 * 60 * 60 * 24));
  
      if(daysSinceReset <= 30){
        if (customerData && customerData.lineupCount === 3) {
          await loyaltyreward(customerData?.email!, {customer: customerData?._id})
            } 
        if (customerData && customerData.lineupCount === 4) {
          // await loyaltyreward(customerData?.email!, {customer: customerData?._id})
      
          if(customerData!.level === 'Newbie' || customerData!.level === null){
            
            customerData!.level ='Novice'
            await customerData?.save()
            await NoviceEmail(customerData?.email!, {customer: customerData?._id})
          }else
          if(customerData!.level === 'Novice'){
            customerData!.level ='OG'
            await customerData?.save()
            await OGEmail(customerData?.email!, {customer: customerData?._id})
          }else
      
          if(customerData!.level === 'OG'){
            customerData!.level ='Upgraded'
            await customerData?.save()
            await UpgradedEmail(customerData?.email!, {customer: customerData?._id})
          }
          if(customerData!.level === 'Upgraded'){
            customerData!.level ='Rich'
            await customerData?.save()
            await RichEmail(customerData?.email!, {customer: customerData?._id})
          }else
          if(customerData!.level === 'Rich'){
            customerData!.level ='Insider'
            await customerData?.save()
            await InsiderEmail(customerData?.email!, {customer: customerData?._id})
          }else
          if(customerData!.level === 'Insider'){
            customerData!.level ='Special'
            await customerData?.save()
            await SpecialEmail(customerData?.email!, {customer: customerData?._id})
          }
          if(customerData!.level === 'Special'){
            customerData!.level ='Hero'
            await customerData?.save()
            await HeroEmail(customerData?.email!, {customer: customerData?._id})
      
          }else
          if(customerData!.level === 'Hero'){
            customerData!.level ='Ambassador'
            await customerData?.save()
            await AmbassadorEmail(customerData?.email!, {customer: customerData?._id})
          }
          await customerData?.save()
      
        } 
        
        if(customerData && customerData!.lineupCount === 4){
          customerData.lineupCount = 0;
          customerData.lastLineupReset = now;
          await customerData!.save();
    
      }  else if(customerData && customerData.lineupCount <= 3){
          customerData.lineupCount +=1;
          await customerData!.save();
        }
        else{
          console.log('conditions skipped')
        }
  
      } 
      
      if(daysSinceReset > 30){
        if(LastLineup <= 7 && customerData!.lineupCount === 4){
          if (customerData){
            customerData.lineupCount = 0;
            customerData.lastLineupReset = now;
  
          }
          await customerData!.save();
        }else{
          if (customerData){
  
          customerData.lineupCount =1;
          customerData.lastLineupReset = now;
          await customerData!.save();
          }
  
        }
      }
  
      const trans = await transaction.findOne({customer: customer_id, status: 'successful'}).sort({createdAt: -1})
  
      const promo = await promoCode.findById(trans?.applied_promo)
  
      const _lineup = await foodbox.create({
        ...dto,
        customer: customer_id,
        week: dto?.week || 1,
        isReturningCustomer: returning,
        coupon_applied: promo?.code.toLocaleUpperCase(),
        createdBy: admin?._id,
        editedBy: admin?._id,
      });
      _lineup.delivery_date = deli_date ?? new Date();
      await _lineup.save()
      await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, 
        delivery_date: deli_date }).exec();
  
        const __sub = await subscription.findOne({ customer: customer_id });
        if (__sub) {
          __sub.status = 'inactive';
          __sub.used_sub = true;
          await __sub.save();
        }
    await FoodBoxService.lockLineupChange(customer_id);
  
      // Emit event
      await NourishaBus.emit("foodbox:created", { owner: customer_id, lineup: _lineup, dto });
      const emails = [
        'Victorianourisha@gmail.com',
        'nourishaorders@gmail.com',
        'shukazuby@gmail.com',
  
      ]
  
  
      const payload = {
        deliveryDate: _lineup.delivery_date,
        subject: ` New Order: Lineup Added by ${customerData?.first_name} ${customerData?.last_name}`,
        customer: customerData?._id
      }
  
      await sendOrderAlert( emails, payload)
  
      console.log('Kitchen Email Sent to Admins - Admin Dashboard', ` Lineup Added by ${customerData?.first_name} ${customerData?.last_name}`)
  
  
      return _lineup;
    }
  
    async adminUpdateFoodBox(
      adminId: string,
      customer_id: string,
      lineup_id: string,
      dto: Partial<FoodBox>,
      roles: string[],
      dryRun = false
    ): Promise<any> {
      await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.MEAL, [
        PermissionScope.READ,
        PermissionScope.ALL,
      ]);
      await FoodBoxService.validateLockedLineupChange(customer_id);
      const admin = await customer.findById(adminId)
  
      const cs = await csteam.findOne({team_member: admin?._id})
      if(!cs){
          throw createError(
            ` You can't update this lineup. Not a CS Member`,
            400
          );
  }
  
  
    const _lineup = await foodbox
      .findOneAndUpdate({ _id: lineup_id, customer: customer_id }, { ...omit(dto, ["customer"]) }, { new: true })
      .lean<FoodBox>()
      .exec();
    if (!_lineup && !dryRun) throw createError("Customer's weekly lineup does not exist", 404);
    await customer.updateOne({ _id: customer_id }, { lineup: _lineup?._id, delivery_date: dto?.delivery_date, editedBy: admin?._id }).exec();

  await FoodBoxService.lockLineupChange(customer_id);

  return _lineup;
  }
    
    async getNextDayDelivery (roles: string[]) {
    
        await RoleService.requiresPermission(
          [AvailableRole.SUPERADMIN],
          roles,
          AvailableResource.MEAL,
          [PermissionScope.READ, PermissionScope.ALL]
        );
    
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        const nextDayStart = new Date(nextDay.setHours(0, 0, 0, 0));
        const nextDayEnd = new Date(nextDay.setHours(23, 59, 59, 999));
        
    
        const orderFilter = {status: 'payment_received', delivery_date: { $gte: nextDayStart, $lte: nextDayEnd } };
        const lineupFilter = { status: 'active', delivery_date: { $gte: nextDayStart, $lte: nextDayEnd } };
    
        const orders = await order
          .find(orderFilter)
          .populate('customer')
          .lean()
          .exec();
    
        const lineups = await foodbox
          .find(lineupFilter)
          .populate('customer')
          .lean()
          .exec();
    
        if (!orders.length && !lineups.length) {
          console.log( "No next-day deliveries found");
        }
    
        return {_orders:{totalcount: orders.length, data: orders},_lineups:{totalcount: lineups.length, lineup: lineups}, }
    
    };

    static async lockLineupChange(customer_id: string, dryRun = true) {

      const info = await DeliveryService.updateNextLineupChangeDate(customer_id);
      if (!info && !dryRun) throw createError("Unable to lock lineup changes", 400);
      return;
    }
      
    static async validateLockedLineupChange(customer_id: string): Promise<void> {
      const result = await DeliveryService.canUpdateLineup(customer_id);
      if (!result) return;
  
    }
  
}