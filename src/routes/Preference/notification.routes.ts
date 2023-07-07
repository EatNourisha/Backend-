import { Router } from "express";
import { authGuard } from "../../middlewares";
import { NotificationController } from "../../controllers";

const router = Router();
const controller = new NotificationController();

router.get("/me", authGuard, controller.getCurrentUserNotifications);
router.put("/:id/read", authGuard, controller.markAsRead);


router.post("/test", authGuard, controller.testNotification);

export default router;
