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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_service_1 = require("./role.service");
const valueObjects_1 = require("../valueObjects");
const consola_1 = __importDefault(require("consola"));
const pullAll_1 = __importDefault(require("lodash/pullAll"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const capitalize_1 = __importDefault(require("lodash/capitalize"));
const roleService = new role_service_1.RoleService();
class SystemService {
    static ensureResources() {
        return __awaiter(this, void 0, void 0, function* () {
            const availableResources = Object.values(valueObjects_1.AvailableResource);
            const r = (yield role_service_1.RoleService.getResourceByNames(availableResources)).map((resource) => resource === null || resource === void 0 ? void 0 : resource.name);
            const rs = (0, pullAll_1.default)(availableResources, r);
            if (!(0, isEmpty_1.default)(rs)) {
                const toRun = [];
                availableResources.forEach((resource) => toRun.push(roleService.createResource(resource)));
                const resources = yield Promise.all(toRun);
                return resources;
            }
            return [];
        });
    }
    static ensureRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const availableRoles = Object.values(valueObjects_1.AvailableRole);
            const r = (yield role_service_1.RoleService.getRoleBySlugs(availableRoles)).map((role) => role === null || role === void 0 ? void 0 : role.name);
            const rs = (0, pullAll_1.default)(availableRoles, r);
            if (!(0, isEmpty_1.default)(rs)) {
                const toRun = [];
                availableRoles.forEach((role) => toRun.push(roleService.createRole(role)));
                const roles = yield Promise.all(toRun);
                return roles;
            }
            return [];
        });
    }
    static ensurePermissions(roleId, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PERMISSIONS TO ENSURE", String(roleId), permissions);
            const toRun = [];
            const resources = yield role_service_1.RoleService.getResourceByNames(permissions.map((p) => p.name));
            const getResourceId = (resourceName) => { var _a; return (_a = resources.find((r) => r.name === resourceName)) === null || _a === void 0 ? void 0 : _a._id; };
            if (!(0, isEmpty_1.default)(permissions)) {
                permissions.forEach((permission) => {
                    const resourceId = getResourceId(permission.name);
                    console.log("resourceId", String(resourceId));
                    resourceId &&
                        toRun.push(roleService.addPermission(String(roleId), {
                            resourceId: String(resourceId),
                            scopes: permission.scopes,
                        }));
                });
                const result = yield Promise.all(toRun);
                return result;
            }
            return [];
        });
    }
    static ensureScopes(roleSlug, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRun = [];
            const role = yield role_service_1.RoleService.getRoleBySlug(roleSlug);
            const resources = yield role_service_1.RoleService.getResourceByNames(permissions.map((p) => p.name));
            const getResourceId = (resourceName) => { var _a; return (_a = resources.find((r) => r.name === resourceName)) === null || _a === void 0 ? void 0 : _a._id; };
            if (role) {
                permissions.forEach((permission) => {
                    const resourceId = getResourceId(permission.name);
                    resourceId && toRun.push(roleService.managePermissionScopes(String(role._id), String(resourceId), permission.scopes));
                });
                const result = yield Promise.all(toRun);
                return result;
            }
            return [];
        });
    }
    ensureSystemServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const toRun = [SystemService.ensureRoles(), SystemService.ensureResources()];
            const [roles] = yield Promise.all(toRun);
            const defaultAccessControlRoles = Object.keys(valueObjects_1.DefaultAccessControls);
            const permissionsToEnsure = [];
            const getRoleId = (slug) => { var _a; return (_a = roles === null || roles === void 0 ? void 0 : roles.find((role) => role.slug === slug)) === null || _a === void 0 ? void 0 : _a._id; };
            const unassignedRoles = roles.map((role) => role === null || role === void 0 ? void 0 : role.slug);
            if (!(0, isEmpty_1.default)(roles)) {
                unassignedRoles === null || unassignedRoles === void 0 ? void 0 : unassignedRoles.forEach((role) => role &&
                    defaultAccessControlRoles.includes(role) &&
                    permissionsToEnsure.push(SystemService.ensurePermissions(getRoleId(role), valueObjects_1.DefaultAccessControls[role].permissions)));
                yield Promise.all(permissionsToEnsure);
                unassignedRoles.forEach((role) => consola_1.default.success((0, capitalize_1.default)(role)));
            }
            else {
                defaultAccessControlRoles.forEach((role) => permissionsToEnsure.push(SystemService.ensureScopes(role, valueObjects_1.DefaultAccessControls[role].permissions)));
                yield Promise.all(permissionsToEnsure);
                defaultAccessControlRoles.forEach((role) => consola_1.default.success((0, capitalize_1.default)(role)));
            }
        });
    }
}
exports.default = SystemService;
//# sourceMappingURL=system.service.js.map