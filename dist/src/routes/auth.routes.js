"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
const controller = new controllers_1.AuthController();
router.post("/login", middlewares_1.deviceGuard, controller.login);
router.post("/reset", middlewares_1.deviceGuard, controller.resetPassword);
router.post("/verify/email", middlewares_1.authGuard, controller.verifyEmail);
router.post("/register", middlewares_1.deviceGuard, controller.registerCustomerAccount);
router.post("/request/reset", middlewares_1.deviceGuard, controller.requestResetPasswordToken);
router.get("/request/email", middlewares_1.authGuard, controller.requestEmailVerification);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map