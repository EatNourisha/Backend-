import { NextFunction, Request, Response } from "express";
import {categoryService, } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new categoryService();

export class categoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createCategory(body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer, params } = req;
      const data = await service.updateCategory(params.id, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deletecategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params } = req;
      const data = await service.deleteCategory(params.id, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  async getcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req;
      const data = await service.getCategory([], query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

}
