import { NextFunction, Request, Response } from "express";
import { CartService } from "../../services";
import { sendError, sendResponse } from "../../utils";

const service = new CartService();

export class CartController {
  //   async createCard(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { body, customer } = req;
  //       const data = await service.createCard(body, customer.roles);
  //       sendResponse(res, 201, data);
  //     } catch (error) {
  //       sendError(error, next);
  //     }
  //   }

  async getCartItemCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.getCartItemCount(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  // async getCart(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { customer, query } = req;
  //     const data = await service.getCart(customer.sub, customer.roles, query);
  //     sendResponse(res, 200, data);
  //   } catch (error) {
  //     sendError(error, next);
  //   }
  // }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body, headers, query } = req;
      
      const device_id = headers['device-id'] || body.device_id;
  
      const customer_id = customer?.sub || null;
  
      const data = await service.getCart(customer_id, customer?.roles || [], query, device_id);
  
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // async addItemToCart(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { customer, body } = req;
  //     const data = await service.addItemToCart(customer.sub, body, customer.roles);
  //     sendResponse(res, 200, data);
  //   } catch (error) {
  //     sendError(error, next);
  //   }
  // }

  async addItemToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body, headers } = req;
      
      const device_id = headers['device-id'] || body.device_id;
  
      const customer_id = customer?.sub || null;
  
      const data = await service.addItemToCart(customer_id, body, customer?.roles || [], device_id);
  
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  
  async removeItemFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, body, headers } = req;
      
      const device_id = headers['device-id'] || body.device_id;
  
      const customer_id = customer?.sub || null;
  
      const data = await service.removeItemFromCart(customer_id, body, customer?.roles || [], device_id);
  
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // async removeItemFromCart(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { customer, body } = req;
  //     const data = await service.removeItemFromCart(customer.sub, body, customer.roles);
  //     sendResponse(res, 200, data);
  //   } catch (error) {
  //     sendError(error, next);
  //   }
  // }

  async weekendDeliveryUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.weekendDeliveryUpdate(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
  async inweekDeliveryUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer } = req;
      const data = await service.inweekDeliveryUpdate(customer.sub, customer.roles);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async deleteCarts(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, query } = req;
      const data = await service.deleteCarts( customer.roles, query);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

}
