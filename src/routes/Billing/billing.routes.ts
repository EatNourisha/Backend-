import { Router } from "express";
import { authGuard } from "../../middlewares";
import { BillingController } from "../../controllers";

const router = Router();
const controller = new BillingController();

// router.post("/checkout", authGuard, controller.createCheckoutSession);
router.post("/card-intent", authGuard, controller.createSteupIntent);
router.post("/subscribe", authGuard, controller.initializeSubscription);

// router.put("/:id", authGuard, controller.updatePlan);

export default router;
