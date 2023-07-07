import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import {  NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId } from "./getCustomer";

export default class SubscriptionEventListener {

  @addEvent("subscription:updated")
  static async OnSubscriptionUpdated({ owner }: NourishaEventTypes["subscription:updated"]) {
    const customer_id = getCustomerId(owner);
    const content = `👏 Your subscription was successfully, proceed to add your meal lineup if you haven't`;
    const note = await NotificationService.notify(customer_id, {tag: 'subscription', content, title: 'Subscription', ticker: 'New message'});

    console.log("Sent Notification", note)
    if(!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }

  @addEvent("subscription:cancelled")
  static async OnSubscriptionCancelled({ owner }: NourishaEventTypes["subscription:cancelled"]) {
    const customer_id = getCustomerId(owner);
    const content = `😒 Your subscription has been cancelled`
    const note = await NotificationService.notify(customer_id, {tag: 'subscription', content, title: 'Subscription', ticker: 'New message'})
    if(!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }

}
