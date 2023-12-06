import { Router } from "express";
import { authGuard } from "../../middlewares";
import { DiscountController } from "../../controllers";

const router = Router();
const controller = new DiscountController();

router.get("/", authGuard, controller.getPromoCodes);
router.post("/", authGuard, controller.createPromoCode);

// router.post("/", authGuard, controller.createCard);
// router.delete("/:id", authGuard, controller.deleteCard);

export default router;
