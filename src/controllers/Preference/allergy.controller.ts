import { NextFunction, Request, Response } from "express";
import { AllergyService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new AllergyService();

export class AllergyController {
  async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createAllergy(body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getAllergies(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAllergyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.getAllergyById(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params, body } = req;
      const data = await service.updateAllergy(params.id, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.deleteAllergy(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
