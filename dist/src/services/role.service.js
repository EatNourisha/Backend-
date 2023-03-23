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
exports.RoleService = void 0;
const utils_1 = require("../utils");
const models_1 = require("../models");
const auth_service_1 = require("./auth.service");
const consola_1 = __importDefault(require("consola"));
const uniq_1 = __importDefault(require("lodash/uniq"));
const difference_1 = __importDefault(require("lodash/difference"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const intersection_1 = __importDefault(require("lodash/intersection"));
class RoleService {
    createRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name)
                throw (0, utils_1.createError)("Role name is required", 400);
            return (yield models_1.role
                .findOneAndUpdate({ name }, { name, slug: (0, utils_1.createSlug)(name) }, (0, utils_1.getUpdateOptions)())
                .lean()
                .exec());
        });
    }
    assignRole(roleId, customerId, invalidateAuthCode = true) {
        return __awaiter(this, void 0, void 0, function* () {
            invalidateAuthCode && (yield auth_service_1.AuthService.invalidateAuthCode(customerId));
            return (yield models_1.customer
                .findByIdAndUpdate(customerId, { $push: { roles: roleId } }, { new: true })
                .lean()
                .exec());
        });
    }
    unassignRole(roleId, customerId, invalidateAuthCode = true) {
        return __awaiter(this, void 0, void 0, function* () {
            invalidateAuthCode && (yield auth_service_1.AuthService.invalidateAuthCode(customerId));
            return (yield models_1.customer
                .findByIdAndUpdate(customerId, { $pull: { roles: roleId } }, { new: true })
                .lean()
                .exec());
        });
    }
    managePermissionScopes(roleId, resourceId, scopes) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const _temp = (yield models_1.permission
                .findOne({
                role: roleId,
                resource: resourceId,
            })
                .select("scopes")
                .lean()
                .exec());
            const newScopes = (0, difference_1.default)(scopes !== null && scopes !== void 0 ? scopes : [], (0, uniq_1.default)((_b = ((_a = _temp === null || _temp === void 0 ? void 0 : _temp.scopes) !== null && _a !== void 0 ? _a : [])) === null || _b === void 0 ? void 0 : _b.map((s) => s.name)));
            const deletedScopes = (0, difference_1.default)((0, uniq_1.default)((_d = ((_c = _temp === null || _temp === void 0 ? void 0 : _temp.scopes) !== null && _c !== void 0 ? _c : [])) === null || _d === void 0 ? void 0 : _d.map((s) => s.name)), scopes !== null && scopes !== void 0 ? scopes : []);
            if (!(0, isEmpty_1.default)(deletedScopes)) {
                const toRemove = [];
                deletedScopes.map((scope) => toRemove.push(this.revokePermissionScope(roleId, resourceId, scope)));
                yield Promise.all(toRemove);
            }
            if (!(0, isEmpty_1.default)(newScopes)) {
                return (yield models_1.permission
                    .findOneAndUpdate({ role: roleId, resource: resourceId }, {
                    role: roleId,
                    resource: resourceId,
                    $push: {
                        scopes: { $each: newScopes.map((scope) => ({ name: scope })) },
                    },
                }, (0, utils_1.getUpdateOptions)())
                    .lean()
                    .exec());
            }
            else {
                return _temp;
            }
        });
    }
    addPermissionScopes(roleId, resourceId, scopes) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const _temp = (yield models_1.permission
                .findOne({
                role: roleId,
                resource: resourceId,
            })
                .lean()
                .exec());
            const newScopes = (0, difference_1.default)(scopes !== null && scopes !== void 0 ? scopes : [], (0, uniq_1.default)((_b = ((_a = _temp === null || _temp === void 0 ? void 0 : _temp.scopes) !== null && _a !== void 0 ? _a : [])) === null || _b === void 0 ? void 0 : _b.map((s) => s.name)));
            if (!(0, isEmpty_1.default)(newScopes)) {
                return (yield models_1.permission
                    .findOneAndUpdate({ role: roleId, resource: resourceId }, {
                    role: roleId,
                    resource: resourceId,
                    $push: {
                        scopes: { $each: newScopes.map((scope) => ({ name: scope })) },
                    },
                }, (0, utils_1.getUpdateOptions)())
                    .lean()
                    .exec());
            }
            else {
                return _temp;
            }
        });
    }
    revokePermissionScope(roleId, resourceId, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.permission
                .findOneAndUpdate({ role: roleId, resource: resourceId }, { $pull: { scopes: { name: scope } } }, { new: true })
                .lean()
                .exec());
        });
    }
    addPermission(roleId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resourceId, scopes } = input;
            if ((yield models_1.resource.countDocuments({ _id: resourceId })) < 1)
                throw (0, utils_1.createError)("Resource not found", 404);
            if ((yield models_1.role.countDocuments({ _id: roleId })) < 1)
                throw (0, utils_1.createError)("Role not found", 404);
            return (yield models_1.permission
                .findOneAndUpdate({
                resource: resourceId,
                role: roleId,
            }, {
                role: roleId,
                resource: resourceId,
                scopes: scopes.map((scope) => ({ name: scope })),
            }, (0, utils_1.getUpdateOptions)())
                .lean()
                .exec());
        });
    }
    revokePermission(roleId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield models_1.role.countDocuments({ _id: roleId })) < 1)
                throw (0, utils_1.createError)("Role not found", 404);
            return (yield models_1.permission.findOneAndDelete({ resource: resourceId, role: roleId }).lean().exec());
        });
    }
    getPermissions(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.permission.find({ role: roleId }).populate(["resource"]).lean().exec());
        });
    }
    createResource(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value)
                throw (0, utils_1.createError)("Resource name is required", 400);
            const name = (0, utils_1.createSlug)(value);
            return (yield models_1.resource.findOneAndUpdate({ name }, { name }, (0, utils_1.getUpdateOptions)()).lean().exec());
        });
    }
    getResources() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.resource.find().lean().exec());
        });
    }
    deleteResource(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.resource.deleteOne({ _id: id }, { new: true }).lean().exec());
        });
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.role.find().lean().exec());
        });
    }
    static getResourceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield models_1.resource.findOne({ name }).lean().exec());
            if (!res)
                throw (0, utils_1.createError)("Resource not found", 404);
            return res;
        });
    }
    static getResourceByNames(names) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield models_1.resource
                .find({ name: { $in: names } })
                .lean()
                .exec());
            return res;
        });
    }
    static getRoleBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield models_1.role.findOne({ slug }).lean().exec());
            if (!res)
                throw (0, utils_1.createError)("Role not found", 404);
            return res;
        });
    }
    static getRoleBySlugs(slugs) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield models_1.role
                .find({ slug: { $in: slugs } })
                .lean()
                .exec());
            return res;
        });
    }
    static isAdmin(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const _roles = (yield RoleService.getRoleBySlugs([
                models_1.AvailableRole.SUPERADMIN,
                models_1.AvailableRole.MODERATOR,
                models_1.AvailableRole.FLEET_MANAGER,
                models_1.AvailableRole.ACCOUNTS_ADMIN,
            ])).map((role) => String(role === null || role === void 0 ? void 0 : role._id));
            const intersections = (0, intersection_1.default)(_roles, roles);
            return !(0, isEmpty_1.default)(intersections);
        });
    }
    static getRoleById(id, dryRun = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield models_1.role.findById(id).lean().exec());
            if (!res && !dryRun)
                throw (0, utils_1.createError)("Role not found", 404);
            return res;
        });
    }
    static getRoleByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield models_1.role
                .find({ _id: { $in: ids } })
                .lean()
                .exec());
            return res;
        });
    }
    static _requiresPermission(requiredRoleSlug, roles, resourceName, scopes) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRun = [RoleService.getResourceByName(resourceName), RoleService.getRoleBySlug(requiredRoleSlug)];
            const result = yield Promise.all(toRun);
            return Boolean((yield models_1.permission
                .countDocuments({
                role: result[1]._id,
                resource: result[0]._id,
                "scopes.name": { $in: scopes },
            })
                .lean()
                .exec()) && (roles === null || roles === void 0 ? void 0 : roles.includes(String(result[1]._id))));
        });
    }
    static _checkPermission(roleId, resourceName, scopes) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield RoleService.getResourceByName(resourceName);
            return Boolean(yield models_1.permission
                .countDocuments({
                role: roleId,
                resource: res._id,
                "scopes.name": { $in: scopes },
            })
                .lean()
                .exec());
        });
    }
    static requiresPermission(requiredRoleSlugs, roles, resourceName, scopes) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRunInParallel = [];
            requiredRoleSlugs === null || requiredRoleSlugs === void 0 ? void 0 : requiredRoleSlugs.forEach((requiredRole) => toRunInParallel.push(RoleService._requiresPermission(requiredRole, roles, resourceName, scopes)));
            const result = (yield Promise.all(toRunInParallel)).filter(Boolean);
            if (result[0] !== true)
                throw (0, utils_1.createError)("Access denied", 401);
            consola_1.default.success("✅ Access granted");
            return;
        });
    }
    static hasPermission(roles, resourceName, scopes) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRunInParallel = [];
            roles.forEach((role) => toRunInParallel.push(RoleService._checkPermission(role, resourceName, scopes)));
            const result = (yield Promise.all(toRunInParallel)).filter(Boolean);
            if (result[0] !== true)
                throw (0, utils_1.createError)("Access denied", 401);
            consola_1.default.success("✅ Access granted");
            return;
        });
    }
    static hasOneOrMore(roles, roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const _roles = yield RoleService.getRoleBySlugs(roles.map((role) => String(role).toString()));
            const _intersect = (0, intersection_1.default)(roleIds, _roles === null || _roles === void 0 ? void 0 : _roles.map((role) => String(role === null || role === void 0 ? void 0 : role._id)));
            return !(0, isEmpty_1.default)(_intersect);
        });
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map