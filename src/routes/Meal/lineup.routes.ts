import { Router } from "express";
import { authGuard } from "../../middlewares";
import { MealLineupController } from "../../controllers";

const router = Router();
const controller = new MealLineupController();

router.get("/me", authGuard, controller.getCurrentCustomersLineup);
router.get("/today", authGuard, controller.getTodaysLineup);
router.get("/upcoming", authGuard, controller.getUpcomingLineup);

router.post("/", authGuard, controller.createLineup);
router.put("/:id", authGuard, controller.updateLineup);

export default router;
