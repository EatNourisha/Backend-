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
exports.CustomerController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const service = new services_1.CustomerService();
class CustomerController {
    createCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const result = yield service.createCustomer(body);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    setDeliveryDay(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, user } = req;
                const result = yield service.setDeliveryDay(user.sub, body, user.roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getCurrentUserCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sub: id, roles } = req.user;
                const result = yield service.currentUserCustomer(id, roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    updateCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sub: id, roles } = req.user;
                const result = yield service.updateCustomer(id, roles, req.body);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sub, roles } = req.user;
                const result = yield service.changePassword(sub, req.body, roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    deleteCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield service.deleteCustomer(req.user.sub, id, req.user.roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    disableCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield service.disableCustomer(req.user.sub, id, req.user.roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    enableCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield service.enableCustomer(req.user.sub, id, req.user.roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    updatePrimaryRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.updatePrimaryRole(req.params.id, req.body.role, req.user.roles);
                (0, utils_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=customer.controller.js.map