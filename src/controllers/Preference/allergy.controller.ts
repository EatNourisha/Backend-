import { NextFunction, Request, Response } from "express";
import { AllergyService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new AllergyService();

export class AllergyController {
  async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createAllergy(body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const data = await service.getAllergies(user.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAllergyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.getAllergyById(params.id, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params, body } = req;
      const data = await service.updateAllergy(params.id, body, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.deleteAllergy(params.id, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
