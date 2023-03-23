"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
const controller = new controllers_1.MealLineupController();
router.get("/me", middlewares_1.authGuard, controller.getCurrentCustomersLineup);
router.get("/today", middlewares_1.authGuard, controller.getTodaysLineup);
router.get("/upcoming", middlewares_1.authGuard, controller.getUpcomingLineup);
router.post("/", middlewares_1.authGuard, controller.createLineup);
router.put("/:id", middlewares_1.authGuard, controller.updateLineup);
exports.default = router;
//# sourceMappingURL=lineup.routes.js.map