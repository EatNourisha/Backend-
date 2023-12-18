import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new NotificationService();

export class NotificationController {
  async getCurrentUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer } = req;
      const data = await service.getCurrentUserNotifications(customer.sub, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAdminNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer } = req;
      const data = await service.getAdminNotifications(customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.markAsRead(params.id, customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async markAsReadForAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.markAsReadForAdmins(body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async testNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body } = req;
      const data = await NotificationService.notify(customer.sub, body);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  async getSentBroadcasts(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer } = req;
      const data = await service.getSentBroadcasts(customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async sendBroadcast(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await NotificationService.broadcast(body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
