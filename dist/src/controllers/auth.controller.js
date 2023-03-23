"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const valueObjects_1 = require("../valueObjects");
const services_1 = require("../services");
const utils_1 = require("../utils");
const service = new services_1.AuthService();
class AuthController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const deviceId = req.headers["device-id"];
                const roles = req.query.role ? [req.query.role] : undefined;
                const data = yield service.register(body, deviceId, roles);
                (0, utils_1.sendResponse)(res, 201, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    registerCustomerAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const deviceId = req.headers["device-id"];
                const data = yield service.registerWithRole(body, valueObjects_1.AvailableRole.CUSTOMER, deviceId);
                (0, utils_1.sendResponse)(res, 201, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const deviceId = req.headers["device-id"];
                const data = yield service.login(body, deviceId);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    requestEmailVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield service.requestEmailVerification(req.user.sub);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    requestResetPasswordToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield service.requestResetPasswordToken(req.body.email);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    verifyEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.body;
                const deviceId = req.headers["device-id"];
                const data = yield service.verifyEmail(req.user.sub, code, req.user.roles, deviceId);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, customer_id, password } = req.body;
                const data = yield service.resetPassword({ token, customer_id, password });
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map