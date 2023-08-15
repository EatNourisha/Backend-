import { Router } from "express";
import { authGuard } from "../../middlewares";
import { NotificationController } from "../../controllers";

const router = Router();
const controller = new NotificationController();

router.get("/me", authGuard, controller.getCurrentUserNotifications);
router.get("/broadcasts", authGuard, controller.getSentBroadcasts);
router.put("/:id/read", authGuard, controller.markAsRead);


router.post("/test", authGuard, controller.testNotification);
router.post("/broadcasts", authGuard, controller.sendBroadcast);

export default router;
