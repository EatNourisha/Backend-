import { NextFunction, Request, Response } from "express";
import { MealService, } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new MealService();

export class MealController {
  async createMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createMeal(body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, params } = req;
      const data = await service.updateMealPack(params.id, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.deleteMealPack(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createMealPack(body, customer.roles);
    
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMeals(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getMeals(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealPacks(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req;
      const data = await service.getMealPacks([], query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealPacksAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getMealPacksAdmin(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getBulkMealPacksAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getBulkMealPacksAdmin(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealById(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = req;
      const data = await service.getMealById(params.id, []);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealPackById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.getMealPackById(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealPackAnalysisById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params, query } = req;
      const data = await service.getMealPackAnalysisById(params.id, customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async requestPartyMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const data = await service.requestPartyMeal(body);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getPartyMealRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getPartyMealRequests(customer.sub, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createMealExtras(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createMealExtras(body, customer.roles);
    
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealExtras(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getMealExtras(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateMealExtras(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, params } = req;
      const data = await service.updateMealExtras(params.id, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteMealExtras(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.deleteMealExtras(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

}
