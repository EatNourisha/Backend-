import { NextFunction, Request, Response } from "express";
import { DeliveryService } from "../../services";
import { sendError, sendResponse } from "../../utils";

export class DeliveryController {
  async getDeliveryInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await new DeliveryService().getDeliveryInfo(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateDeliveryDayOfWeek(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await DeliveryService.updateDeliveryDayOfWeek(customer.sub, body.day, body.date);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async fixMissingCustomerDeliveryDay(_: Request, res: Response, next: NextFunction) {
    try {
      // const { customer, body } = req;
      const data = await new DeliveryService().fixMissingCustomersDeliveryDay();
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateNextDeliveryDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body } = req;
      const data = await DeliveryService.updateNextDeliveryDate(customer.sub, body.day, body.skip_check, body.change_day_index);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
