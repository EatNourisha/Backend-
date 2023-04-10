import { Router } from "express";
import { authGuard } from "../../middlewares";
import { PlanController } from "../../controllers";

const router = Router();
const controller = new PlanController();

router.get("/", authGuard, controller.getPlans);

router.post("/", authGuard, controller.createPlan);
router.put("/:id", authGuard, controller.updatePlan);

export default router;
