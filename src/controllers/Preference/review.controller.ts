import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new ReviewService();

export class ReviewController {


  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.addReview(user.sub, body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params, body } = req;
      const data = await service.updateReview(params.id, user.sub, body, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCustomerReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const data = await service.getCustomerReviews(user.sub, user.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin 
  async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, user } = req;
      const data = await service.getAllReviews(user.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getReviewsByCustomerId(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, user, params } = req;
      const data = await service.getReviewsByCustomerId(params.id, user.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
