import { NextFunction, Request, Response } from "express";
import { sendError, sendResponse } from "../utils";
import { ReferralService } from "../services";

const service = new ReferralService();

export class ReferralController {
  async getCustomerPendingReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer } = req;
      const data = await service.getCustomerPendingReferrals(customer.sub, customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCustomerCompletedReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, customer } = req;
      const data = await service.getCustomerCompletedReferrals(customer.sub, customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getTotalReferredCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getTotalReferredCustomers(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  //   async getLineupById(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { customer, params, query } = req;
  //       console.log('getLineup', query)
  //       const data = await service.getLineupById(params.id, customer.roles, !!query?.silent);
  //       sendResponse(res, 200, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  async getReferralStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getReferralStats(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAllInvitedCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getAllInvitedCustomers(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getAllSubscribedInvitedCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.getAllSubscribedInvitedCustomers(customer.roles, query as any);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
