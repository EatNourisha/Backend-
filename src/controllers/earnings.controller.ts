import { NextFunction, Request, Response } from "express";
import { sendError, sendResponse } from "../utils";
import { EarningsService } from "../services";

const service = new EarningsService();

export class EarningsController {
  async getCustomerEarnings(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getCustomerEarnings(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async requestWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.requestWithdrawal(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  //   async getLineupById(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { customer, params, query } = req;
  //       console.log('getLineup', query)
  //       const data = await service.getLineupById(params.id, customer.roles, !!query?.silent);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }
}
