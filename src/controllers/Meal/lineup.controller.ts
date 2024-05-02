import { NextFunction, Request, Response } from "express";
import { MealLineupService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new MealLineupService();

export class MealLineupController {
  async createLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, query } = req;
      const { week } = query;
      const newBody = { ...body, week };
      const data = await service.createLineup(customer.sub, newBody, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, params } = req;
      const data = await service.updateLineup(customer.sub, params.id, body, customer.roles, Boolean(params?.dryRun));
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCurrentCustomersLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getCurrentCustomersLineup(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getTodaysLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getTodaysLineup(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  async getUpcomingLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getUpcomingLineup(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  async getLineupById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params, query } = req;
      console.log("getLineup", query);
      const data = await service.getLineupById(params.id, customer.roles, !!query?.silent);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
