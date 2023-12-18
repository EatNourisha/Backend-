import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId, getCustomerInfo } from "./getCustomer";
import { when } from "../utils/when";
import { join } from "lodash";

export default class SubscriptionEventListener {
  @addEvent("subscription:updated")
  static async OnSubscriptionUpdated({ owner, subscription }: NourishaEventTypes["subscription:updated"]) {
    const customer_id = getCustomerId(owner);

    const info = await getCustomerInfo(owner);
    const name = when(!!info, join([info?.first_name, info?.last_name], " "), `ID:${customer_id}`);

    const content = `👏 Your subscription was successful, proceed to add your meal lineup if you haven't`;
    const adminContent = `${name}'s subscription is now ${subscription?.status}`;

    const meta = { customer: customer_id, sub_id: subscription?._id };

    const [note] = await Promise.all([
      NotificationService.notify(customer_id, {
        tag: "subscription",
        content,
        title: "Subscription",
        ticker: "New message",
      }),

      NotificationService.notifyAdmins({
        tag: "subscription",
        content: adminContent,
        title: "Subscription was updated",
        ticker: "new",
        metadata: meta,
      }),
    ]);

    console.log("Sent Notification", note);
    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }

  @addEvent("subscription:cancelled")
  static async OnSubscriptionCancelled({ owner, subscription }: NourishaEventTypes["subscription:cancelled"]) {
    const customer_id = getCustomerId(owner);
    const info = await getCustomerInfo(owner);
    const name = when(!!info, join([info?.first_name, info?.last_name], " "), `ID:${customer_id}`);

    const content = `😒 Your subscription has been cancelled`;
    const adminContent = `${name} cancelled his/her subscription`;

    const meta = { customer: customer_id, sub_id: subscription?._id };

    const note = await Promise.all([
      NotificationService.notify(customer_id, {
        tag: "subscription",
        content,
        title: "Subscription",
        ticker: "New message",
      }),

      NotificationService.notifyAdmins({
        tag: "subscription",
        content: adminContent,
        title: "Subscription was cancelled",
        ticker: "new",
        metadata: meta,
      }),
    ]);
    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);
  }
}
