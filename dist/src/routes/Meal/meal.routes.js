"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
const controller = new controllers_1.MealController();
router.post("/", middlewares_1.authGuard, controller.createMeal);
router.post("/pack", middlewares_1.authGuard, controller.createMealPack);
router.get("/", middlewares_1.authGuard, controller.getMeals);
router.get("/pack", middlewares_1.authGuard, controller.getMealPacks);
router.get("/pack/:id", middlewares_1.authGuard, controller.getMealPackById);
router.get("/:id", middlewares_1.authGuard, controller.getMealById);
exports.default = router;
//# sourceMappingURL=meal.routes.js.map