import { Router } from "express";
import { authGuard } from "../../middlewares";
import { CartController } from "../../controllers";

const router = Router();
const controller = new CartController();

router.get("/", authGuard, controller.getCart);
router.put("/", authGuard, controller.addItemToCart);
router.delete("/", authGuard, controller.removeItemFromCart);
router.put("/weekend-delivery", authGuard, controller.weekendDeliveryUpdate);
router.put("/inweek-delivery", authGuard, controller.inweekDeliveryUpdate);

// router.post("/", authGuard, controller.createCard);
// router.delete("/:id", authGuard, controller.deleteCard);

export default router;
