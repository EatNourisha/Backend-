import { NextFunction, Request, Response } from "express";
import { PlanService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new PlanService();

export class PlanController {
  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createPlan(body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, params } = req;
      const data = await service.updatePlan(params.id, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.deletePlan(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getPlans(customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.getPlanById(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async assignPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body, params } = req;
      const data = await service.assignPlan(params.id, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
