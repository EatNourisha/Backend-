"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
const controller = new controllers_1.CustomerController();
router.get("/me", middlewares_1.authGuard, controller.getCurrentUserCustomer);
router.put("/me", middlewares_1.authGuard, controller.updateCustomer);
router.put("/password", middlewares_1.authGuard, controller.changePassword);
router.put("/delivery", middlewares_1.authGuard, controller.setDeliveryDay);
router.delete("/:id", middlewares_1.authGuard, controller.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customer.routes.js.map