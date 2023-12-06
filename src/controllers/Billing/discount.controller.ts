import { NextFunction, Request, Response } from "express";
import { DiscountService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new DiscountService();

export class DiscountController {
  async getPromoCodes(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getPromos(customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createPromoCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body } = req;
      const data = await service.createPromoCode(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  //   async deleteCard(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { customer, params } = req;
  //       const data = await service.deleteCard(params.id, customer.roles);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }
}
