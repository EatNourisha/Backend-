import { NextFunction, Request, Response } from "express";
import { TransactionService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new TransactionService();

export class TransactionController {
  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { params, customer } = req;
      const data = await service.getTransactionById(params.id as string, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getTransactions(customer.sub, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // admin

  async getCustomerTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer: admin, query, params } = req;
      const data = await service.getCusomterTransactions(params.id, admin.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
