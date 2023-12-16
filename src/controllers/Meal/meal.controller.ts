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
      const { customer, query } = req;
      const data = await service.getMealPacks(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.getMealById(params.id, customer.roles);
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
}
