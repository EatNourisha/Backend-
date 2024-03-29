import { NextFunction, Request, Response } from "express";
import { SubscriptionService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new SubscriptionService();

export class SubscriptionController {
  async getCurrentUsersSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getCurrentUsersSubscription(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.cancelSubscription(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  async getSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getSubscriptions(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
