import { Router } from "express";
import { MobileUseController } from "../controllers";

const router = Router();
const controller = new MobileUseController();

router.post("/", controller.saveString);
router.get("/", controller.getString);

export default router;
