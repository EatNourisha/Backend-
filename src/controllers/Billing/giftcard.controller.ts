import { NextFunction, Request, Response } from "express";
import { GiftCardService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new GiftCardService();

export class GiftCardController {
    async createGiftCard(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, body } = req;
        const data = await service.createGiftCard(body, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }
  
    async buyGiftCard(req: Request, res: Response, next: NextFunction) {
      try {
        const { customer, body } = req;
        const data = await service.buyGiftCard(customer.sub, body, customer.roles);
        sendResponse(res, 201, data);
      } catch (error) {
        sendError(error, next);
      }
    }
  
    async deleteGiftCard(req: Request, res: Response, next: NextFunction) {
        try {
          const { customer, params } = req;
          const data = await service.deleteGiftCard(params.id, customer.roles);
          sendResponse(res, 200, data);
        } catch (error) {
          sendError(error, next);
        }
      }
      async getGiftCards(req: Request, res: Response, next: NextFunction) {
        try {
          const { query } = req;
          const data = await service.getGiftCards([], query as any);
          sendResponse(res, 200, data);
        } catch (error) {
          sendError(error, next);
        }
      }
    
      async getCustomerGiftPurchase(req: Request, res: Response, next: NextFunction) {
        try {
          const {customer,  query } = req;
          const data = await service.getCustomerGiftPurchase(customer.sub, query as any);
          sendResponse(res, 200, data);
        } catch (error) {
          sendError(error, next);
        }
      }
    
      async getCustomerCustomGift(req: Request, res: Response, next: NextFunction) {
        try {
          const {customer,  query } = req;
          const data = await service.getCustomerCustomGift(customer.sub, query as any);
          sendResponse(res, 200, data);
        } catch (error) {
          sendError(error, next);
        }
      }
    
      async createCustomGift(req: Request, res: Response, next: NextFunction) {
        try {
          const { customer, body } = req;
          const data = await service.createCustomGift(customer.sub, body, customer.roles);
          sendResponse(res, 201, data);
        } catch (error) {
          sendError(error, next);
        }
      }
  
      async deleteCustomGift(req: Request, res: Response, next: NextFunction) {
        try {
          const { customer, params } = req;
          const data = await service.deleteCustomGift(params.id, customer.roles);
          sendResponse(res, 200, data);
        } catch (error) {
          sendError(error, next);
        }
      }
  
  }
  