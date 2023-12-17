import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { MealLineupService, NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId } from "./getCustomer";
import { LineupQueue } from "../queues";

export default class LineupEventListener {
  @addEvent("lineup:created")
  static async OnLineupCreated({ owner, dto }: NourishaEventTypes["lineup:updated"]) {
    const customer_id = getCustomerId(owner);
    const content = `👏 Your meal lineup was successfully added, proceed to add a delivery day if you haven't`;
    const note = await NotificationService.notify(customer_id, { tag: "lineup", content, title: "Meal Lineup", ticker: "New message" });
    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);

    // Create meal pack analysis
    const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto);
    for (const lysis of analysis) LineupQueue.add("create_mealpack_analysis_data", lysis);
  }

  @addEvent("lineup:updated")
  static async OnLineupUpdated({ owner, dto }: NourishaEventTypes["lineup:updated"]) {
    const customer_id = getCustomerId(owner);
    const content = `😒 Your meal lineup has been updated`;
    const note = await NotificationService.notify(customer_id, { tag: "lineup", content, title: "Meal Lineup", ticker: "New message" });
    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);

    // Update meal pack analysis
    const analysis = await MealLineupService.createLineupAnalysis(customer_id, dto);
    for (const lysis of analysis) LineupQueue.add("create_mealpack_analysis_data", lysis);
  }
}
