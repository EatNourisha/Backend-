import { NextFunction, Request, Response } from "express";
import { TransactionService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new TransactionService();

export class TransactionController {
  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { params, user } = req;
      const data = await service.getTransactionById(params.id as string, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const data = await service.getTransactions(user.sub, user.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
