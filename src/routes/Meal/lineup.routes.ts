import { Router } from "express";
import { authGuard, subscriptionGuard } from "../../middlewares";
import { MealLineupController } from "../../controllers";

const router = Router();
const controller = new MealLineupController();

router.get("/me", authGuard, controller.getCurrentCustomersLineup);
router.get("/today", authGuard, controller.getTodaysLineup);
router.get("/upcoming", authGuard, controller.getUpcomingLineup);
router.get("/all", authGuard, controller.getLineups);
router.get("/byId/:lineupId", authGuard, controller.getLineupByLineId);
router.get("/import/previous", authGuard, controller.importPreviousLineup);
router.get("/all/previous/lineups", authGuard, controller.customerPreviousLineups);
router.get("/import/previous/:id", authGuard, controller.importPreviousLineupById);

router.post("/", authGuard, subscriptionGuard, controller.createLineup);
router.post("/web", authGuard, subscriptionGuard, controller.createLineupWeb);
router.put("/:id", authGuard, subscriptionGuard, controller.updateLineup);
router.put("/swallow/:id", authGuard, subscriptionGuard, controller.updateSwallow);

// Admin
router.get("/:id", authGuard, controller.getLineupById);

export default router;
