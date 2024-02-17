import { Router } from "express";
import { CustomerController } from "../controllers";


const router = Router();
const controller = new CustomerController();

router.get("/countries",  controller.getCountries); // ✅


export default router;