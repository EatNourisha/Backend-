import { Router } from "express";
import { authGuard } from "../../middlewares";
import { csTeamController } from "../../controllers";

const router = Router();
const controller = new csTeamController();

router.post("/:id", authGuard, controller.addCsMember);
router.post("/assign/:cusId/:teamId", authGuard, controller.assignCs);
router.post("/followup/:cusId", authGuard, controller.addFollowUp);
router.post("/report/:cusId", authGuard, controller.addReport);
router.get("/", authGuard, controller.getAllCs);
router.get("/followup/:cusId", authGuard, controller.getCustomerFollowHistory);
router.get("/report/:cusId", authGuard, controller.getCustomerReportHistory);
router.get("/get/cs/:adminId", authGuard, controller.getACsByAdminId);
router.get("/:id", authGuard, controller.getACs);
router.delete("/:id", authGuard, controller.removeACs);

export default router;
