import { NextFunction, Request, Response } from "express";
import { BillingService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new BillingService();

export class BillingController {
  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createCheckoutSession(user.sub, body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createSetupIntentSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createSetupIntentSession(user.sub, body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async createSteupIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.createSetupIntent(user.sub, body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async initializeSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const data = await service.initializeSubscription(user.sub, body, user.roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  //   async updateBilling(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { body, user, params } = req;
  //       const data = await service.updateBilling(params.id, body, user.roles);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  //   async getBillings(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { user } = req;
  //       const data = await service.getBillings(user.roles);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }
}
