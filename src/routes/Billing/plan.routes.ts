import { Router } from "express";
import { authGuard } from "../../middlewares";
import { PlanController } from "../../controllers";

const router = Router();
const controller = new PlanController();

router.get("/", authGuard, controller.getPlans);
router.get("/:id", authGuard, controller.getPlanById);

router.post("/", authGuard, controller.createPlan);
router.put("/:id", authGuard, controller.updatePlan);

router.delete("/:id", authGuard, controller.deletePlan);

export default router;
