import { Router } from "express";
import { authGuard } from "../../middlewares";
import { CardController } from "../../controllers";

const router = Router();
const controller = new CardController();

router.get("/", authGuard, controller.getCards);

// router.post("/", authGuard, controller.createCard);
router.delete("/:id", authGuard, controller.deleteCard);

export default router;
