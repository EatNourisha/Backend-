import { NextFunction, Request, Response } from "express";
import { CardService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new CardService();

export class CardController {
  //   async createCard(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { body, customer } = req;
  //       const data = await service.createCard(body, customer.roles);
  //       sendResponse(res, 201, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.getCurrentUserCards(customer.sub, customer.roles, params);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.deleteCard(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
