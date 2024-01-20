import { add, getDay, isPast, nextDay } from "date-fns";
import { Customer, DeliveryInfo, customer, deliveryInfo } from "../../models";
import { getUpdateOptions } from "../../utils";
import { when } from "../../utils/when";
import { RoleService } from "../role.service";
import { AvailableResource, PermissionScope } from "../../valueObjects";

const days_of_week = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
type DaysOfWeekType = (typeof days_of_week)[number];

export class DeliveryService {
  async getDeliveryInfo(customer_id: string, roles: string[], dry_run = false): Promise<DeliveryInfo> {
    if (!dry_run) await RoleService.hasPermission(roles, AvailableResource.MEAL, [PermissionScope.READ, PermissionScope.ALL]);
    const info = await DeliveryService.updateNextLineupChangeDate(customer_id);
    return await DeliveryService.updateNextDeliveryDate(customer_id, info, true);
  }

  static async updateNextDeliveryDate(customer_id: string, info: DeliveryInfo, skip_check?: boolean, lineup_change_day_index?: number) {
    const { delivery_day, next_delivery_date: ndd } = info;
    const cus = await customer.findById(customer_id).select(["createdAt", "delivery_day"]).lean<Customer>().exec();

    const dd = cus?.delivery_day ?? delivery_day;
    const delivery_day_index = days_of_week.indexOf(dd);
    let next_delivery_date = ndd ?? nextDay(new Date(), delivery_day_index as any);

    // skip check for existing customers, else check for new customers.
    const is_existing = isPast(add(cus?.createdAt!, { days: 7 }));
    skip_check = skip_check ?? when(is_existing, true, false);

    console.log("Skipping check...", skip_check);

    if (!skip_check) {
      const has_past = this.hasPastRecommendedLineupChangeDate(new Date(), lineup_change_day_index);
      // if day_index is the middle of the week or towards the weekend, skip the delivery for that week to the next delivery_day
      next_delivery_date = when(has_past, nextDay(next_delivery_date, delivery_day_index as any), next_delivery_date);
    }

    const dinfo = await deliveryInfo
      .findOneAndUpdate({ customer: customer_id }, { customer: customer_id, next_delivery_date, delivery_day: dd }, getUpdateOptions())
      .lean<DeliveryInfo>()
      .exec();

    if (!cus?.delivery_info) await customer.updateOne({ _id: customer_id }, { delivery_info: dinfo?._id }).exec();
    return dinfo;
  }

  static async updateDeliveryDayOfWeek(customer_id: string, delivery_day: DaysOfWeekType, delivery_date: Date) {
    const info = await deliveryInfo
      .findOneAndUpdate(
        { customer: customer_id },
        { customer: customer_id, delivery_day, next_delivery_date: delivery_date },
        getUpdateOptions()
      )
      .lean<DeliveryInfo>()
      .exec();
    await customer.findByIdAndUpdate(customer_id, { delivery_day, delivery_info: info }).lean<Customer>().exec();
    return info;
  }

  static async updateNextLineupChangeDate(customer_id: string) {
    const has_past_required = this.hasPastRecommendedLineupChangeDate(new Date());
    const is_locked = has_past_required;

    const delivery_day_index = days_of_week.indexOf("sunday");
    const next_change_date = nextDay(new Date(), delivery_day_index as any).setHours(7, 0);

    const info = await deliveryInfo
      .findOneAndUpdate(
        { customer: customer_id },
        { customer: customer_id, is_lineup_change_locked: is_locked, next_lineup_change_date: next_change_date },
        getUpdateOptions()
      )
      .lean<DeliveryInfo>()
      .exec();
    return info;
  }

  async fixMissingCustomersDeliveryDay() {
    const cus = await customer.find({ delivery_day: null }).select(["_id", "delivery_day"]).lean<Customer[]>().exec();
    console.log("Customers", cus);
    const to_run = cus?.map((c) => this.fixMissingDeliveryDay(c));
    return (await Promise.all(to_run)).filter(Boolean);
  }

  async fixMissingDeliveryDay(cus: Customer) {
    if (!cus) return;
    try {
      const di = await deliveryInfo.findOne({ customer: cus?._id! }).lean<DeliveryInfo>().exec();
      if (!di) return;
      return await customer.findByIdAndUpdate(cus?._id, { delivery_day: di?.delivery_day }, { new: true }).lean<Customer>().exec();
    } catch (error) {}

    return;
  }

  static async resetCustomerDeliveryInfo(customer_id: string) {
    await customer.updateOne({ _id: customer_id }, { $unset: { lineup: 1 } });
    const dinfo = await deliveryInfo
      .findOneAndUpdate(
        { customer: customer_id },
        { is_lineup_change_locked: false, next_lineup_change_date: null, next_delivery_date: null }
      )
      .lean<DeliveryInfo>()
      .exec();

    return dinfo;
  }

  static async canUpdateLineup(customer_id: string) {
    const info = await this.updateNextLineupChangeDate(customer_id);
    return { is_locked: info.is_lineup_change_locked, next_change_date: info.next_lineup_change_date };
  }

  /**
   * Checks if the recommended lineup change date has past.
   * The recommended lineup change date is before Wednesday 12PM weekly
   */
  static hasPastRecommendedLineupChangeDate(date: Date, lineup_change_day_index?: number): boolean {
    const day_index = lineup_change_day_index ?? getDay(date);
    const that_day_by_12pm = new Date().setHours(12, 0);
    return (day_index === 3 && isPast(that_day_by_12pm)) || day_index > 3;
  }
}
