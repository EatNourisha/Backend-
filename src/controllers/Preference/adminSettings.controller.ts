import { NextFunction, Request, Response } from "express";
import { AdminSettingsService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new AdminSettingsService();

export class AdminSettingsController {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getSettings(customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateAdminSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body } = req;
      const data = await service.updateSettings(customer.sub, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
