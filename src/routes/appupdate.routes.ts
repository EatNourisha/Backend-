import { CustomerController } from './../controllers/customer.controller';
import { Router } from "express";
// import { CustomerController } from "../controllers";


const router = Router();
const controller = new CustomerController();

router.get('/appUpdates', controller.getAppUpdates);
router.post('/createUpdates', controller.addAppUpdate);
router.put('/appUpdates/:updateId', controller.updateAppUpdate);

export default router;