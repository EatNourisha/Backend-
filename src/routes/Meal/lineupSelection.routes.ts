import { Router } from "express";
import { authGuard, subscriptionGuard } from "../../middlewares";
import { LineupSelectionController } from "../../controllers";

const router = Router();
const controller = new LineupSelectionController();

router.post("/", authGuard, subscriptionGuard, controller.createLineup);
router.get("/me", authGuard, controller.getCurrentCustomersLineup);
// router.get("/today", authGuard, controller.getTodaysLineup);
// router.get("/upcoming", authGuard, controller.getUpcomingLineup);
router.get("/all", authGuard, controller.getLineups);
router.get("/byId/:lineupId", authGuard, controller.getLineupByLineId);
router.get("/import/previous", authGuard, controller.importPreviousLineup);
router.get("/all/previous/lineups", authGuard, controller.customerPreviousLineups);
router.get("/import/previous/:id", authGuard, controller.importPreviousLineupById);
router.get("/asian/delivery/dates", controller.getAsianDelivery);

router.post("/web", authGuard, subscriptionGuard, controller.createLineupWeb);
// router.put("/:id", authGuard, subscriptionGuard, controller.updateLineup);
// router.put("/swallow/:id", authGuard, subscriptionGuard, controller.updateSwallow);

// Admin
router.get("/:id", authGuard, controller.getLineupById);
router.post("/:id", authGuard, controller.adminCreateLineup);
router.put("/:customerId/:id/", authGuard, controller.adminUpdateLineup);
router.get("/next/day/delivery", authGuard, controller.getNextDayDelivery);

export default router;
