import { Router } from "express";
import { authGuard } from "../middlewares";
import { ReferralController } from "../controllers";

const router = Router();
const controller = new ReferralController();

router.get("/pending", authGuard, controller.getCustomerPendingReferrals);
router.get("/completed", authGuard, controller.getCustomerCompletedReferrals);
router.get("/stats", authGuard, controller.getTotalReferredCustomers);


export default router;
