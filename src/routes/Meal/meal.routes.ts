import { Router } from "express";
import { authGuard } from "../../middlewares";
import { MealController } from "../../controllers";

const router = Router();
const controller = new MealController();

router.post("/", authGuard, controller.createMeal);
router.post("/pack", authGuard, controller.createMealPack);

router.get("/", authGuard, controller.getMeals);
router.get("/pack", authGuard, controller.getMealPacks);

router.get("/pack/:id", authGuard, controller.getMealPackById);
router.get("/:id", authGuard, controller.getMealById);

export default router;
