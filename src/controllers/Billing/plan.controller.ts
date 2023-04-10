import { NextFunction, Request, Response } from "express";
import { PlanService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new PlanService();

export class PlanController {
  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createPlan(body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user, params } = req;
      const data = await service.updatePlan(params.id, body, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.getPlans(user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
