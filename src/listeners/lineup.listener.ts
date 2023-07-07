import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import {  NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId } from "./getCustomer";

export default class LineupEventListener {

  @addEvent("lineup:created")
  static async OnLineupCreated({ owner }: NourishaEventTypes["lineup:updated"]) {
    const customer_id = getCustomerId(owner);
    const content = `👏 Your meal lineup was successfully added, proceed to add a delivery day if you haven't`;
    const note = await NotificationService.notify(customer_id, {tag: 'lineup', content, title: 'Meal Lineup', ticker: 'New message'})
    if(!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }

  @addEvent("lineup:updated")
  static async OnLineupUpdated({ owner }: NourishaEventTypes["lineup:updated"]) {
    const customer_id = getCustomerId(owner);
    const content = `😒 Your meal lineup has been updated`
    const note = await NotificationService.notify(customer_id, {tag: 'lineup', content, title: 'Meal Lineup', ticker: 'New message'})
    if(!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }

}
