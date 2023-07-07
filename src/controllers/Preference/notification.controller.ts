import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new NotificationService();

export class NotificationController {
  async getCurrentUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, user } = req;
      const data = await service.getCurrentUserNotifications(user.sub, user.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.markAsRead(params.id, user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async testNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, body } = req;
      const data = await NotificationService.notify(user.sub, body);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
