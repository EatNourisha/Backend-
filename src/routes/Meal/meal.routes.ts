import { Router } from "express";
import { authGuard, deviceGuard } from "../../middlewares";
import { MealController, categoryController } from "../../controllers";

const router = Router();
const controller = new MealController();
const categController = new categoryController();

router.post("/", authGuard, controller.createMeal);
router.post("/pack", authGuard, controller.createMealPack);
router.put("/pack/:id", authGuard, controller.updateMealPack);
router.delete("/pack/:id", authGuard, controller.deleteMealPack);

// router.get("/", authGuard, controller.getMeals);
router.get("/pack", deviceGuard, controller.getMealPacks);
router.get("/pack/admin", authGuard, controller.getMealPacksAdmin);

router.get("/pack/:id", authGuard, controller.getMealPackById);
// router.get("/pack/admin/:id", authGuard, controller.getMealByIdAdmin);
router.get("/pack/analysis/:id", authGuard, controller.getMealPackAnalysisById);

router.get("/parties", authGuard, controller.getPartyMealRequests);
router.post("/parties", deviceGuard, controller.requestPartyMeal);


router.post("/category", authGuard, categController.createCategory);
router.put("/category/:id", authGuard, categController.updateCategory);
router.delete("/category/:id", authGuard, categController.deletecategory);
router.get("/category", deviceGuard, categController.getcategory);
export default router;
