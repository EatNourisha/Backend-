import { NextFunction, Request, Response } from "express";
import { MealLineupService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new MealLineupService();

export class MealLineupController {
  async createLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createLineup(user.sub, body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user, params } = req;
      const data = await service.updateLineup(user.sub, params.id, body, user.roles, Boolean(params?.dryRun));
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCurrentCustomersLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.getCurrentCustomersLineup(user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getTodaysLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.getTodaysLineup(user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  async getUpcomingLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.getUpcomingLineup(user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
