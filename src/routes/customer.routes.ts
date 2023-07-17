import { Router } from "express";
import { CustomerController } from "../controllers";
import { authGuard } from "../middlewares";

const router = Router();
const controller = new CustomerController();
// const coinController = new CoinController();

// router.get("/test", authGuard, controller.testCustomerEvents);

// Supposedly Admin
router.get("/dashboard", authGuard, controller.getFeatureCounts); // ✅
router.get("/me", authGuard, controller.getCurrentUserCustomer); // ✅
router.get("/admins", authGuard, controller.getAdmins); // ✅
router.get("/", authGuard, controller.getCustomers); // ✅
router.get("/:id", authGuard, controller.getCustomerById); // ✅

// GET
router.get("/", authGuard, controller.getCustomers); // ✅
router.get("/:id", authGuard, controller.getCustomerById); // ✅

// POST
// router.post("/", authGuard, controller.createCustomer); // ✅
router.post("/test_mailgun", controller.testEmail); // ✅
router.post("/test_sendgrid", controller.testSendgrid); // ✅

// PUT
router.put("/me", authGuard, controller.updateCustomer); // ✅
router.put("/password", authGuard, controller.changePassword); // ✅
router.put("/delivery", authGuard, controller.setDeliveryDay); // ✅
router.put("/fcm", authGuard, controller.updateFCMToken); // ✅
router.put("/allergies", authGuard, controller.addCustomerAllergy); // ✅
router.put("/:id/notes", authGuard, controller.updateCustomerNote); // ✅
router.put("/:id/disable", authGuard, controller.disableCustomer); // ✅
router.put("/:id/enable", authGuard, controller.enableCustomer); // ✅
router.put("/:id/make_admin", authGuard, controller.makeCustomerAdmin); // ✅
router.put("/:id/revoke_admin", authGuard, controller.revokeAdminPrivilege); // ✅
// router.put("/:id/primaryRole", authGuard, controller.updatePrimaryRole); // ✅

// DELETE
router.delete("/:id", authGuard, controller.deleteCustomer); // ✅
router.delete("/allergies", authGuard, controller.removeCustomerAllergy); // ✅




export default router;
