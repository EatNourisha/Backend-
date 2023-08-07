import { Router } from "express";
import { authGuard } from "../../middlewares";
import { ReviewController } from "../../controllers";

const router = Router();
const controller = new ReviewController();

router.post("/", authGuard, controller.addReview);
router.put("/:id", authGuard, controller.updateReview);

router.get("/", authGuard, controller.getAllReviews);
router.get("/me", authGuard, controller.getCustomerReviews);
router.get("/customer/:id", authGuard, controller.getReviewsByCustomerId);


export default router;
