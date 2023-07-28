import { NextFunction, Request, Response } from "express";
import { sendError, sendResponse } from "../utils";
import { ReferralService } from "../services";

const service = new ReferralService();

export class ReferralController {

  async getCustomerPendingReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, user } = req;
      const data = await service.getCustomerPendingReferrals(user.sub, user.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCustomerCompletedReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, user } = req;
      const data = await service.getCustomerCompletedReferrals(user.sub, user.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getTotalReferredCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await service.getTotalReferredCustomers(user.sub, user.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }


  // Admin
//   async getLineupById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { user, params, query } = req;
//       console.log('getLineup', query)
//       const data = await service.getLineupById(params.id, user.roles, !!query?.silent);
//       sendResponse(res, 200, data);
//     } catch (error) {
//       sendError(error, next);
//     }
//   }
}
