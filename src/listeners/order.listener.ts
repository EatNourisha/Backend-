import { NourishaEventTypes } from "../libs";
import { addEvent } from "../decorators";
import { NotificationService } from "../services";
import { log } from "../utils";
import { getCustomerId, getCustomerInfo } from "./getCustomer";
import { EmailQueue } from "../queues";
import { join } from "lodash";
import { when } from "../utils/when";
import { format } from "date-fns";

export default class OrderEventListener {
  @addEvent("order:placed")
  static async OnOrderPlaced({ owner, order }: NourishaEventTypes["order:placed"]) {
    const customer_id = getCustomerId(owner);

    const info = await getCustomerInfo(owner);
    const name = when(!!info, join([info?.first_name, info?.last_name], " "), `ID:${customer_id}`);

    const content = `👏 Your order has been successfully placed and your mouthwatering selections are in the works`;
    const adminContent = `${name} placed a paid order`;

    const meta = { customer: customer_id, order: order?._id };

    const [note] = await Promise.all([
      NotificationService.notify(customer_id, { tag: "order", content, title: "New Order Placed", ticker: "New message" }),
      NotificationService.notifyAdmins({
        tag: "order",
        content: adminContent,
        title: "New Order Placed",
        ticker: "new",
        metadata: meta,
      }),
    ]);

    if (!!note) log("🚀 Notifications", `Sent ( ${content} ) to customer:${customer_id}`);

    const payload = {
      name: info?.first_name,
      email: info?.email,
      order_ref_id: order?.ref,
      delivery_address: order?.delivery_address?.address_,
      delivery_date: format(order?.delivery_date, "eee dd, MMM yyyy"),
      //   delivery_date: when(
      //     typeof order?.delivery_date === "string",
      //     format(parseISO(order?.delivery_date as any), "eee DD, MMM yyyy"),
      //     format(order?.delivery_date, "eee DD, MMM yyyy")
      //   ),
    };

    console.log("Email Payload", typeof order?.delivery_date, payload);

    EmailQueue.add("send_placed_order_email", payload);
  }
}
