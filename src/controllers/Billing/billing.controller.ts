import { NextFunction, Request, Response } from "express";
import { BillingService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new BillingService();

export class BillingController {
  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createCheckoutSession(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createSetupIntentSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createSetupIntentSession(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createSteupIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.createSetupIntent(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async initializeSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, customer } = req;
      const data = await service.initializeSubscription(customer.sub, body, customer.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  //   async updateBilling(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { body, customer, params } = req;
  //       const data = await service.updateBilling(params.id, body, customer.roles);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  //   async getBillings(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { customer } = req;
  //       const data = await service.getBillings(customer.roles);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }
}
