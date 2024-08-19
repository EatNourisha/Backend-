import { NextFunction, Request, Response } from "express";
import { csTeamService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new csTeamService();


export class csTeamController {
    async addCsMember(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params } = req;
        const data = await service.addCsMember(customer.sub, params.id, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

    async getAllCs(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer } = req;
        const data = await service.getAllCs(customer.sub, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

    async getACs(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params } = req;
        const data = await service.getACs(customer.sub, params.id, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }
    
    async removeACs(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params } = req;
        const data = await service.removeCs(customer.sub, params.id, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

    async assignCs(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params } = req;
        const data = await service.assignCs(customer.sub, params.cusId, params.teamId, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

    async addFollowUp(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params, body} = req;
        const data = await service.addFollowUp(customer.sub, params.cusId, body.text, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

    async addReport(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params, body} = req;
        const data = await service.addReport(customer.sub, params.cusId, body.text, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

    async getCustomerFollowHistory(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, params} = req;
        const data = await service.getCustomerFollowHistory(customer.sub, params.cusId, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }

}