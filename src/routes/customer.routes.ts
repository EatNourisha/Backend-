import { Router } from "express";
import { CustomerController } from "../controllers";
import { authGuard } from "../middlewares";

const router = Router();
const controller = new CustomerController();
// const coinController = new CoinController();

// router.get("/test", authGuard, controller.testCustomerEvents);

// GET
router.get("/me", authGuard, controller.getCurrentUserCustomer); // ✅

// POST
// router.post("/", authGuard, controller.createCustomer); // ✅

// PUT
router.put("/me", authGuard, controller.updateCustomer); // ✅
router.put("/password", authGuard, controller.changePassword); // ✅
router.put("/delivery", authGuard, controller.setDeliveryDay); // ✅
// router.put("/:id/disable", authGuard, controller.disableCustomer); // ✅
// router.put("/:id/enable", authGuard, controller.enableCustomer); // ✅
// router.put("/:id/primaryRole", authGuard, controller.updatePrimaryRole); // ✅

// DELETE
router.delete("/:id", authGuard, controller.deleteCustomer); // ✅

export default router;
