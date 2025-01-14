import { Router } from "express";
import { authGuard, subscriptionGuard } from "../../middlewares";
import { FoodBoxController } from "../../controllers";

const router = Router();
const controller = new FoodBoxController();

router.post("/", authGuard, subscriptionGuard, controller.createFoodBox);
router.get("/me", authGuard, controller.getCurrentCustomersFoodBox);
// router.get("/today", authGuard, controller.getTodaysLineup);
// router.get("/upcoming", authGuard, controller.getUpcomingLineup);
router.get("/all", authGuard, controller.getFoodBoxes);
router.get("/byId/:foodboxId", authGuard, controller.getFoodBoxByFoodBoxId);
router.get("/import/previous", authGuard, controller.importPreviousLineup);
router.get("/all/previous/foodboxes", authGuard, controller.customerPreviousLineups);
router.get("/import/previous/:id", authGuard, controller.importPreviousLineupById);
router.get("/asian/delivery/dates", controller.getAsianDelivery);

router.post("/web", authGuard, subscriptionGuard, controller.createFoodBoxWeb);
// router.put("/:id", authGuard, subscriptionGuard, controller.updateLineup);
// router.put("/swallow/:id", authGuard, subscriptionGuard, controller.updateSwallow);

// Admin
router.get("/:id", authGuard, controller.getFoodBoxById);
router.post("/:id", authGuard, controller.adminCreateFoodBox);
router.put("/:customerId/:id/", authGuard, controller.adminUpdateFoodBox);
router.get("/next/day/delivery", authGuard, controller.getNextDayDelivery);

export default router;
