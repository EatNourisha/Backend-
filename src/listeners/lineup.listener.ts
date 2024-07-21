import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { MealLineupService, NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId, getCustomerInfo } from "./getCustomer";
import { LineupQueue } from "../queues";
import { join } from "lodash";
import { when } from "../utils/when";

export default class LineupEventListener {
  @addEvent("lineup:created")
  static async OnLineupCreated({ owner, dto }: NourishaEventTypes["lineup:updated"]) {
    const customer_id = getCustomerId(owner);

    const info = await getCustomerInfo(owner);
    const name = when(!!info, join([info?.first_name, info?.last_name], " "), `ID:${customer_id}`);

    const content = `👏 Your meal lineup was successfully added, proceed to add a delivery day if you haven't`;
    const adminContent = `${name} added his/her meal lineup`;

    const meta = { customer: customer_id };

    const [note] = await Promise.all([
      NotificationService.notify(customer_id, { tag: "lineup", content, title: "Meal Lineup", ticker: "New message" }),
      NotificationService.notifyAdmins({
        tag: "lineup",
        content: adminContent,
        title: "New lineup was added",
        ticker: "new",
        metadata: meta,
      }),
      MealLineupService.decreaseAvailableMealpackQuantities(dto),
    ]);

    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);

    // Create meal pack analysis
    const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto);
    for (const lysis of analysis) LineupQueue.add("create_mealpack_analysis_data", lysis);
  }

  @addEvent("lineup:updated")
  static async OnLineupUpdated({ owner, dto }: NourishaEventTypes["lineup:updated"]) {
    const customer_id = getCustomerId(owner);

    const info = await getCustomerInfo(owner);
    const name = when(!!info, join([info?.first_name, info?.last_name], " "), `ID:${customer_id}`);

    const content = `😒 Your meal lineup has been updated`;
    const adminContent = `${name} updated his/her meal lineup`;

    const meta = { customer: customer_id };

    const [note] = await Promise.all([
      NotificationService.notify(customer_id, { tag: "lineup", content, title: "Meal Lineup", ticker: "New message" }),
      NotificationService.notifyAdmins({
        tag: "lineup",
        content: adminContent,
        title: "Lineup was updated",
        ticker: "new",
        metadata: meta,
      }),
      MealLineupService.decreaseAvailableMealpackQuantities(dto),
    ]);

    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);

    // Update meal pack analysis
    const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto);
    for (const lysis of analysis) LineupQueue.add("create_mealpack_analysis_data", lysis);
  }
  @addEvent("lineup:reminder")
  static async onLineupReminder({ owner }: NourishaEventTypes["lineup:reminder"]) {
    const customer_id = getCustomerId(owner);

    const info = await getCustomerInfo(owner);
    const name = when(!!info, join([info?.first_name, info?.last_name], " "), `ID:${customer_id}`);

    const content = `🙃 Monthly subscription: add your next meal lineup if you haven't`;
    const adminContent = `${name} added his/her next meal lineup`;

    const meta = { customer: customer_id };

    const [note] = await Promise.all([
      NotificationService.notify(customer_id, { tag: "lineup", content, title: "Meal Lineup", ticker: "New message" }),
      NotificationService.notifyAdmins({
        tag: "lineup",
        content: adminContent,
        title: "Next lineup was added",
        ticker: "new",
        metadata: meta,
      }),
      // MealLineupService.decreaseAvailableMealpackQuantities(dto),
    ]);

    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);

    // // next meal pack analysis
    // const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto);
    // for (const lysis of analysis) LineupQueue.add("create_mealpack_analysis_data", lysis);
  }


}
