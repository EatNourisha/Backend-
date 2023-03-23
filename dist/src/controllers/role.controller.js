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
exports.RoleController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const service = new services_1.RoleService();
class RoleController {
    createResource(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const result = yield service.createResource(name);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    deleteResource(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield service.deleteResource(id);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    assignRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.assignRole(req.params.roleId, req.body.customer_id);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    unassignRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.unassignRole(req.params.roleId, req.body.customer_id);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    createRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const result = yield service.createRole(name);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getResources(_, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.getResources();
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getRoles(_, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.getRoles();
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    addPermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.addPermission(req.params.id, req.body);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    revokePermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, resId } = req.params;
                const result = yield service.revokePermission(id, resId);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getPermissions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield service.getPermissions(id);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    addPermissionScopes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resourceId, scopes } = req.body;
                const result = yield service.addPermissionScopes(req.params.roleId, resourceId, scopes);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    revokePermissionScope(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roleId, resourceId, scope } = req.params;
                const result = yield service.revokePermissionScope(roleId, resourceId, scope);
                (0, utils_1.sendResponse)(res, 201, result);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map