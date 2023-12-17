import { Router } from "express";
import { authGuard } from "../../middlewares";
import { DiscountController } from "../../controllers";

const router = Router();
const controller = new DiscountController();

router.get("/promos", authGuard, controller.getPromoCodes);
router.get("/promos/:id", authGuard, controller.getPromoCodeById);
router.post("/promos", authGuard, controller.createPromoCode);

router.put("/promos/:id", authGuard, controller.updatePromoCode);
router.delete("/promos/:id", authGuard, controller.deletePromoCode);

export default router;
