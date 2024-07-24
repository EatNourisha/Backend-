import { Router } from "express";
import { authGuard } from "../../middlewares";
import { SubscriptionController } from "../../controllers";

const router = Router();
const controller = new SubscriptionController();

router.put("/cancel", authGuard, controller.cancelSubscription);
router.get("/me", authGuard, controller.getCurrentUsersSubscription);

router.get("/", authGuard, controller.getSubscriptions);
router.get("/:id", authGuard, controller.getACusSub);
router.put("/active/:id", authGuard, controller.updateSubSatatus);

export default router;
