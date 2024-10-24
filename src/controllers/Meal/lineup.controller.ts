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

  async createLineupWeb(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, query } = req;
      const { week } = query;
      const newBody = { ...body, week };
      const data = await service.createLineupWeb(customer.sub, newBody, customer.roles);
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

  async updateSwallow(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body, params } = req;
      const data = await service.updateSwallow(customer.sub, params.id, customer.roles, body);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCurrentCustomersLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const weekParam = query.week;
      const week = typeof weekParam === 'string' ? parseInt(weekParam, 10) : undefined;      
      const data = await service.getCurrentCustomersLineup(customer.sub, customer.roles, week);
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
  async getLineupByLineId(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params, query } = req;
      const data = await service.getLineupByLineupId(params.lineupId, customer.roles, !!query?.silent);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getLineups(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
  
      const status = typeof query.status === 'string' ? query.status : undefined;
      const week = typeof query.week === 'string' ? query.week : undefined;
      const limit = query.limit ? parseInt(query.limit as string, 10) : undefined;
      const page = query.page ? parseInt(query.page as string, 10) : undefined;
  
      const data = await service.getLineups(customer.roles, !!query?.silent, status, week, limit, page);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async importPreviousLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.importPreviousLineup(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  async importPreviousLineupById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.importPreviousLineupById(customer.sub, params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  async customerPreviousLineups(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.customerPreviousLineups(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAsianDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const {  } = req;
      const data = await service.getAsianDelivery();
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

}
