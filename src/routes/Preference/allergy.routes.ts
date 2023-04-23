import { Router } from "express";
import { authGuard } from "../../middlewares";
import { AllergyController } from "../../controllers";

const router = Router();
const controller = new AllergyController();

router.get("/", authGuard, controller.getAllergies);
router.get("/:id", authGuard, controller.getAllergyById);

router.post("/", authGuard, controller.createAllergy);
router.put("/:id", authGuard, controller.updateAllergy);
router.delete("/:id", authGuard, controller.deleteAllergy);

export default router;
