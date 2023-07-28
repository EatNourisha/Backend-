import { Router } from "express";
import { authGuard } from "../middlewares";
import { EarningsController } from "../controllers";

const router = Router();
const controller = new EarningsController();

router.get("/", authGuard, controller.getCustomerEarnings);
router.post("/withdraw", authGuard, controller.requestWithdrawal);


export default router;
