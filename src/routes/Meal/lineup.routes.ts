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

router.post("/", authGuard, subscriptionGuard, controller.createLineup);
router.put("/:id", authGuard, subscriptionGuard, controller.updateLineup);
router.put("/swallow/:id", authGuard, subscriptionGuard, controller.updateSwallow);

// Admin
router.get("/:id", authGuard, controller.getLineupById);

export default router;
