import { Router } from "express";
import { CustomerController } from "../controllers";


const router = Router();
const controller = new CustomerController();

router.get("/countries",  controller.getCountries); // ✅
router.post("/countries",  controller.addCountry); // ✅
router.put("/countries/:id",  controller.updateCountry); // ✅
router.get("/countries/:id",  controller.getCountryById); // ✅
export default router;