import { AvailableRole } from "../valueObjects";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services";
import { sendError, sendResponse } from "../utils";

const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const deviceId = req.headers["device-id"] as string;
      const roles = req.query.role ? [req.query.role as string] : undefined;
      const data = await service.register(body, deviceId, roles);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async registerCustomerAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const deviceId = req.headers["device-id"] as string;
      const data = await service.registerWithRole(body, AvailableRole.CUSTOMER, deviceId);
      sendResponse(res, 201, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const deviceId = req.headers["device-id"] as string;
      const data = await service.login(body, deviceId);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async requestEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.requestEmailVerification(req.customer.sub);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async requestResetPasswordToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.requestResetPasswordToken(req.body.email);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Starting point for password reset on mobile
  async requestResetPasswordOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.requestResetPasswordOTP(req.body.email);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Step two for password reset on mobile, validating the otp to get a reset token
  async validatePasswordResetOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.validatePasswordResetOTP(req.body.code);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      const deviceId = req.headers["device-id"] as string;

      const data = await service.verifyEmail(req.customer.sub, code, req.customer.roles, deviceId);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, customer_id, password } = req.body;
      const data = await service.resetPassword({ token, customer_id, password });
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }

  // Admin
  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      ///// admin login /////
      const deviceId = req.headers["device-id"] as string;
      const data = await service.login(body, deviceId, true);
      sendResponse(res, 200, data);
    } catch (error) {
      sendError(error, next);
    }
  }
}
