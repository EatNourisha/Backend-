import { Router } from "express";
import { authGuard } from "../../middlewares";
import { GiftCardController } from "../../controllers";

const router = Router();
const controller = new GiftCardController();

router.post("/", authGuard, controller.createGiftCard);
router.post("/buy", authGuard, controller.buyGiftCard);
router.get("/", authGuard, controller.getGiftCards);
router.get("/customer", authGuard, controller.getCustomerGiftPurchase);
router.delete("/:id", authGuard, controller.deleteGiftCard);
export default router;
