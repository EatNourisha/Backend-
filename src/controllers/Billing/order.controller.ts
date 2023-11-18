import { NextFunction, Request, Response } from "express";
import { OrderService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new OrderService();

export class OrderController {
  //   async createCard(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { body, customer } = req;
  //       const data = await service.createCard(body, customer.roles);
  //       sendResponse(res, 201, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getOrders(customer.sub, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, params, query } = req;
      const data = await service.getOrderById(params.id, customer.sub, customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body } = req;
      const data = await service.placeOrder(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body, params } = req;
      const data = await service.updateOrderStatus(params.id, customer.sub, body, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
