import { NextFunction, Request, Response } from "express";
import { MealService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new MealService();

export class MealController {
  async createMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createMeal(body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createMealPack(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createMealPack(body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMeals(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const data = await service.getMeals(user.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealPacks(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const data = await service.getMealPacks(user.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.getMealById(params.id, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getMealPackById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const data = await service.getMealPackById(params.id, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
