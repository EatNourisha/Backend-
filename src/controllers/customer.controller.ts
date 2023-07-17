import { NextFunction, Request, Response } from "express";
import { CustomerService, EmailService, Template } from "../services";
import { createError, sendError, sendResponse } from "../utils";

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

  async updateFCMToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const result = await service.updateFCMToken(user.sub, body, user.roles);
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

  async addCustomerAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: id, roles } = req.user;
      const result = await service.addCustomerAllergies(id, req.body, roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async removeCustomerAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: id, roles } = req.user;
      const result = await service.removeCustomerAllergies(id, req.body, roles);
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

  // Admin 
   async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const result = await service.getCustomers(user.roles, query as any);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

   async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, query } = req;
      const result = await service.getAdmins(user.roles, query);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

   async getFeatureCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const result = await service.getFeatureCounts(user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const result = await service.getCustomerById(params.id, user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async updateCustomerNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, body, params } = req;
      const result = await service.updateNote(params.id, body, user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async makeCustomerAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const result = await service.makeAdmin(params.id, user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async revokeAdminPrivilege(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, params } = req;
      const result = await service.revokeAdmin(params.id, user.roles);
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }
  
  async testEmail(_: Request, res: Response, next: NextFunction) {
    try {
      const result = await EmailService.sendMailgunTestEmail();
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

  async testSendgrid(req: Request, res: Response, next: NextFunction) {
    try {
      const {body} = req;
      if(!body?.email) throw createError("email is required in body", 401);
      const result = await EmailService.sendEmail_sendgrid('Test Email', body.email, Template.WELCOME, {name: body?.email});
      sendResponse(res, 200, result);
    } catch (error) {
      sendError(error, next);
    }
  }

}
