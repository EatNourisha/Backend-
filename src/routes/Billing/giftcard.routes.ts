import { Router } from "express";
import { authGuard } from "../../middlewares";
import { GiftCardController } from "../../controllers";

const router = Router();
const controller = new GiftCardController();

router.post("/", authGuard, controller.createGiftCard);
router.post("/buy", authGuard, controller.buyGiftCard);
router.post("/image", authGuard, controller.createGiftImage);
router.post("/custom", authGuard, controller.createCustomGift);
router.get("/custom", authGuard, controller.getCustomerCustomGift);
router.get("/", authGuard, controller.getGiftCards);
router.get("/images", authGuard, controller.getGiftImages);
router.get("/customer", authGuard, controller.getCustomerGiftPurchase); 
router.delete("/:id", authGuard, controller.deleteGiftCard);
router.delete("/custom/:id", authGuard, controller.deleteCustomGift);
export default router;
