import { Router } from "express";
import { authGuard } from "../../middlewares";
import { AdminSettingsController } from "../../controllers";

const router = Router();
const controller = new AdminSettingsController();

router.get("/", authGuard, controller.getSettings);
router.put("/", authGuard, controller.updateAdminSettings);

export default router;
