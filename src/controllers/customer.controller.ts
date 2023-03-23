import { NextFunction, Request, Response } from "express";
import { CustomerService } from "../services";
import { sendError, sendResponse } from "../utils";

const service = new CustomerService();
export class CustomerController {
  // async testCustomerEvents(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { user } = req;
  //     const result = await service.testEvent(user.sub, user.roles);
  //     sendResponse(res, 201, result);
  //   } catch (error) {
  //     sendError(error, next);
  //   }
  // }

  async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const result = await service.createCustomer(body);
      sendResponse(res, 201, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async setDeliveryDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const result = await service.setDeliveryDay(user.sub, body, user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCurrentUserCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: id, roles } = req.user;
      const result = await service.currentUserCustomer(id, roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: id, roles } = req.user;
      const result = await service.updateCustomer(id, roles, req.body);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub, roles } = req.user;
      const result = await service.changePassword(sub, req.body, roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await service.deleteCustomer(req.user.sub, id, req.user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async disableCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await service.disableCustomer(req.user.sub, id, req.user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async enableCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await service.enableCustomer(req.user.sub, id, req.user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updatePrimaryRole(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.updatePrimaryRole(req.params.id, req.body.role, req.user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }
}
