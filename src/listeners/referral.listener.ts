import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import {  NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId } from "./getCustomer";

export default class LineupEventListener {

  @addEvent("referral:created")
  static async OnReferralCreated({ owner }: NourishaEventTypes["referral:created"]) {
    const customer_id = getCustomerId(owner);
    const content = `👏 Your meal lineup was successfully added, proceed to add a delivery day if you haven't`;
    const note = await NotificationService.notify(customer_id, {tag: 'lineup', content, title: 'Meal Lineup', ticker: 'New message'})
    if(!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }

  

}
