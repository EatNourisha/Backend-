import { Router } from "express";
import { authGuard } from "../../middlewares";
import { SubscriptionController } from "../../controllers";

const router = Router();
const controller = new SubscriptionController();

router.put("/cancel", authGuard, controller.cancelSubscription);
router.get("/me", authGuard, controller.getCurrentUsersSubscription);

export default router;
