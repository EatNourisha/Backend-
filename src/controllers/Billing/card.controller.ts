import { NextFunction, Request, Response } from "express";
import { CardService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new CardService();

export class CardController {
  //   async createCard(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { body, user } = req;
  //       const data = await service.createCard(body, user.roles);
  //       sendResponse(res, 201, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.getCurrentUserCards(user.sub, user.roles, params);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.deleteCard(params.id, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
