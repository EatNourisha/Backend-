import { Router } from "express";
import { authGuard } from "../../middlewares";
import { DiscountController } from "../../controllers";

const router = Router();
const controller = new DiscountController();

router.get("/promos", authGuard, controller.getPromoCodes);
router.get("/promos/:id", authGuard, controller.getPromoCodeById);
router.post("/promos", authGuard, controller.createPromoCode);

// router.post("/", authGuard, controller.createCard);
// router.delete("/:id", authGuard, controller.deleteCard);

export default router;
