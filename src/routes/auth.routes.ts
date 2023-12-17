import { Router } from "express";
import { authGuard, deviceGuard } from "../middlewares";
import { AuthController } from "../controllers";

const router = Router();
const controller = new AuthController();

router.post("/login", deviceGuard, controller.login);
router.post("/reset", deviceGuard, controller.resetPassword);

router.post("/verify/email", authGuard, controller.verifyEmail);
router.post("/register", deviceGuard, controller.registerCustomerAccount);
router.post("/verify/reset-otp", deviceGuard, controller.validatePasswordResetOTP);

router.post("/request/reset", deviceGuard, controller.requestResetPasswordToken);
router.post("/request/reset-otp", deviceGuard, controller.requestResetPasswordOTP);
router.get("/request/email", authGuard, controller.requestEmailVerification);

router.post("/admin/login", deviceGuard, controller.adminLogin);

export default router;
