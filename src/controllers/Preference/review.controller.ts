import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new ReviewService();

export class ReviewController {
  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.addReview(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params, body } = req;
      const data = await service.updateReview(params.id, customer.sub, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCustomerReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getCustomerReviews(customer.sub, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer } = req;
      const data = await service.getAllReviews(customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getReviewsByCustomerId(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer, params } = req;
      const data = await service.getReviewsByCustomerId(params.id, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
