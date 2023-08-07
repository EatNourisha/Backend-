


import { Router } from "express";
import { authGuard } from "../../middlewares";
import { DeliveryController } from "../../controllers";

const router = Router();
const controller = new DeliveryController();

// router.post("/", authGuard, controller.createMeal);
// router.put("/deliveryDate", authGuard, controller.updateNextDeliveryDate);
// router.put("/deliveryDay", authGuard, controller.updateDeliveryDayOfWeek);
// router.get("/", authGuard, controller.getMeals);
// router.get("/pack", authGuard, controller.getMealPacks);

// router.get("/pack/:id", authGuard, controller.getMealPackById);
router.get("/info", authGuard, controller.getDeliveryInfo);

export default router;
