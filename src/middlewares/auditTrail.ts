import { NextFunction, Response, Request } from "express";
import { AuditService, AuthService, CustomerService} from "../services";

export const auditLogs = async (req: Request, _: Response, next: NextFunction) => {
  const authService = new AuthService();
  const auditService = new AuditService();
  let token = (req.headers['x-access-token'] || req.headers.authorization) as string;
  let deviceId = req.headers['device-id'] as string;

  if (token) {
    token = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    try {
      const payload = await authService.validateAuthCode(token, deviceId);
      if (payload) {
        await CustomerService.updateLastSeen(payload.sub);
        req.query.userId = payload.sub;
        req.customer = payload;
      } else {
        console.warn('Authorization failed: proceeding without user data');
      }
    } catch (err) {
      console.error('Token validation error:', err);
    }
  } else {
    console.warn('No authorization token provided: proceeding without user data');
  }

  // Remove password from req.body if it exists
  const dataSent = { ...req.body };
  if (dataSent.password) {
    delete dataSent.password;
  }

  // Log the request even if there's no token or validation fails
  const data = {
    status: _.statusCode,
    action: req.method,
    route: req.url,
    dataSent,
    actor: req.customer ? req.customer.sub : 'anonymous',
    ip_address: req.ip,
  };

  try {
    const logs = await auditService.createLog({
      status: data.status,
      action: data.action,
      route: data.route,
      dataSent: data.dataSent,
      actor: data.actor,
      ip_address: data.ip_address,
    });
    logs;
  } catch (err) {
    console.error('Error logging data:', err);
  }

  next();
};


