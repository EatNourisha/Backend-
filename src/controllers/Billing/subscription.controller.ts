import { NextFunction, Request, Response } from "express";
import { SubscriptionService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new SubscriptionService();

export class SubscriptionController {
  async getCurrentUsersSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.getCurrentUsersSubscription(user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.cancelSubscription(user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
