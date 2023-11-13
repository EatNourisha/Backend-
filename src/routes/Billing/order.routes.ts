import { Router } from "express";
import { authGuard } from "../../middlewares";
import { OrderController } from "../../controllers";

const router = Router();
const controller = new OrderController();

router.get("/", authGuard, controller.getOrders);
router.get("/:id", authGuard, controller.getOrderById);
router.post("/", authGuard, controller.placeOrder);
// router.put("/", authGuard, controller.addItemToCart);
// router.delete("/", authGuard, controller.removeItemFromCart);

// router.post("/", authGuard, controller.createCard);
// router.delete("/:id", authGuard, controller.deleteCard);

export default router;
