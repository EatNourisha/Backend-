import { DeliveryService } from "../Meal/delivery.service";

test("should have the correct delivery_day", async () => {
  const info = await DeliveryService.updateDeliveryDayOfWeek("64b67b305a80379a1dbc21b9", "sunday");
  expect(info.delivery_day).toBe("sunday");
});

test("should have the correct delivery date", async () => {
  const info = await DeliveryService.updateDeliveryDayOfWeek("64b67b305a80379a1dbc21b9", "sunday");
  expect(info.delivery_day).toBe("sunday");
});
