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
exports.CustomerService = void 0;
const nanoid_1 = require("nanoid");
const libs_1 = require("../libs");
const models_1 = require("../models");
const utils_1 = require("../utils");
const valueObjects_1 = require("../valueObjects");
const password_service_1 = __importDefault(require("./password.service"));
const role_service_1 = require("./role.service");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const difference_1 = __importDefault(require("lodash/difference"));
const authVerification_service_1 = require("./authVerification.service");
class CustomerService {
    constructor() {
        this.authVerificationService = new authVerification_service_1.AuthVerificationService();
    }
    createCustomer(input, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            let acc = (yield models_1.customer.create(Object.assign(Object.assign({}, input), { control: { enabled: true }, ref_code: (0, nanoid_1.nanoid)(12), roles: roles !== null && roles !== void 0 ? roles : [], is_email_verified: false })));
            yield Promise.allSettled([
                password_service_1.default.addPassword(acc._id, input.password),
                roles && roles[0] && this.updatePrimaryRole(acc._id, roles[0], []),
            ]);
            acc = (yield models_1.customer.findById(acc._id).lean().exec());
            yield libs_1.NourishaBus.emit("customer:created", { owner: acc });
            return acc;
        });
    }
    setDeliveryDay(customer_id, dto, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateFields)(dto, ["delivery_day"]);
            const supported_days = Object.values(models_1.DeliveryDay);
            if (!supported_days.includes(dto.delivery_day))
                throw (0, utils_1.createError)(`Available delivery days are ${supported_days.join(", ")}`, 400);
            yield role_service_1.RoleService.requiresPermission([valueObjects_1.AvailableRole.CUSTOMER], roles, valueObjects_1.AvailableResource.CUSTOMER, [valueObjects_1.PermissionScope.READ]);
            const _customer = yield models_1.customer
                .findByIdAndUpdate(customer_id, Object.assign({}, dto), { new: true })
                .lean()
                .exec();
            if (!_customer)
                throw (0, utils_1.createError)(`Customer not found`, 404);
            return _customer;
        });
    }
    static removeDeprecatedCustomerRoles(customer_id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRun = [];
            const role = yield role_service_1.RoleService.getRoleByIds(roles);
            const existingCustomerRolesInDb = role === null || role === void 0 ? void 0 : role.map((r) => String(r._id));
            const rolesToDelete = (0, difference_1.default)(roles, existingCustomerRolesInDb);
            if (!(0, isEmpty_1.default)(rolesToDelete)) {
                rolesToDelete.forEach((roleId) => toRun.push(new role_service_1.RoleService().unassignRole(roleId, customer_id, false)));
                return yield Promise.all(toRun);
            }
            return [];
        });
    }
    currentUserCustomer(id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRun = [
                CustomerService.removeDeprecatedCustomerRoles(id, roles),
                role_service_1.RoleService.requiresPermission([valueObjects_1.AvailableRole.CUSTOMER, valueObjects_1.AvailableRole.SUPERADMIN], roles, valueObjects_1.AvailableResource.CUSTOMER, [
                    valueObjects_1.PermissionScope.READ,
                    valueObjects_1.PermissionScope.ALL,
                ]),
            ];
            yield Promise.allSettled(toRun);
            let data = yield models_1.customer.findById(id).lean().exec();
            if (!data)
                throw (0, utils_1.createError)(`Not found`, 404);
            if (!(data === null || data === void 0 ? void 0 : data.ref_code))
                data = yield models_1.customer
                    .findByIdAndUpdate(id, { ref_code: (0, nanoid_1.nanoid)(12) }, { new: true })
                    .lean()
                    .exec();
            return data;
        });
    }
    updatePrimaryRole(id, role, roles, dryRun = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dryRun)
                yield role_service_1.RoleService.requiresPermission([valueObjects_1.AvailableRole.SUPERADMIN], roles, valueObjects_1.AvailableResource.CUSTOMER, [
                    valueObjects_1.PermissionScope.UPDATE,
                    valueObjects_1.PermissionScope.ALL,
                ]);
            const res = yield role_service_1.RoleService.getRoleById(role);
            const acc = (yield models_1.customer.findOneAndUpdate({ _id: id }, { primary_role: res.slug }, { new: true }).lean().exec());
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            return acc;
        });
    }
    updateCustomer(id, roles, input) {
        return __awaiter(this, void 0, void 0, function* () {
            input = CustomerService.removeUpdateForcedInputs(input);
            if ((0, isEmpty_1.default)(input))
                throw (0, utils_1.createError)("No valid input", 404);
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.CUSTOMER, [valueObjects_1.PermissionScope.UPDATE, valueObjects_1.PermissionScope.ALL]);
            const data = yield models_1.customer
                .findOneAndUpdate({ _id: id }, Object.assign({}, input), { new: true })
                .lean()
                .exec();
            if (!data)
                throw (0, utils_1.createError)(`Customer not found`, 404);
            return data;
        });
    }
    changePassword(customer_id, input, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.CUSTOMER, [valueObjects_1.PermissionScope.UPDATE, valueObjects_1.PermissionScope.ALL]);
            const acc = yield password_service_1.default.changePassword(customer_id, input);
            yield libs_1.NourishaBus.emit("customer:password:changed", { owner: acc });
            return acc;
        });
    }
    deleteCustomer(sub, id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.requiresPermission([valueObjects_1.AvailableRole.SUPERADMIN], roles, valueObjects_1.AvailableResource.CUSTOMER, [
                valueObjects_1.PermissionScope.DELETE,
                valueObjects_1.PermissionScope.ALL,
            ]);
            const data = yield models_1.customer.findOneAndDelete({ _id: id }, { new: true }).lean().exec();
            if (!data)
                throw (0, utils_1.createError)(`Not found`, 404);
            yield libs_1.NourishaBus.emit("customer:deleted", { owner: data, modifier: sub });
            return data;
        });
    }
    disableCustomer(sub, id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.requiresPermission([valueObjects_1.AvailableRole.SUPERADMIN], roles, valueObjects_1.AvailableResource.CUSTOMER, [
                valueObjects_1.PermissionScope.DISABLE,
                valueObjects_1.PermissionScope.ALL,
            ]);
            const data = yield models_1.customer
                .findOneAndUpdate({ _id: id }, { control: { suspended: false } }, { new: true })
                .lean()
                .exec();
            if (!data)
                throw (0, utils_1.createError)(`Customer not found`, 404);
            yield libs_1.NourishaBus.emit("customer:disabled", { owner: data, modifier: sub });
            return data;
        });
    }
    enableCustomer(sub, id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.requiresPermission([valueObjects_1.AvailableRole.SUPERADMIN], roles, valueObjects_1.AvailableResource.CUSTOMER, [
                valueObjects_1.PermissionScope.ENABLE,
                valueObjects_1.PermissionScope.ALL,
            ]);
            const data = yield models_1.customer
                .findOneAndUpdate({ _id: id }, { control: { suspended: true } }, { new: true })
                .lean()
                .exec();
            if (!data)
                throw (0, utils_1.createError)(`Customer not found`, 404);
            yield libs_1.NourishaBus.emit("customer:enabled", { owner: data, modifier: sub });
            return data;
        });
    }
    verifyEmail(input, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.CUSTOMER, [valueObjects_1.PermissionScope.VERIFY, valueObjects_1.PermissionScope.ALL]);
            if (!(yield CustomerService.checkCustomerExists(input.customer_id)))
                throw (0, utils_1.createError)("Customer not found", 404);
            const verification = yield this.authVerificationService.getEmailVerification(input.customer_id, valueObjects_1.AuthVerificationReason.ACCOUNT_VERIFICATION, input.code, true);
            const _customer = yield models_1.customer
                .findByIdAndUpdate(input.customer_id, { is_email_verified: true }, { new: true })
                .lean()
                .exec();
            yield this.authVerificationService.removeVerification(verification._id);
            yield libs_1.NourishaBus.emit("customer:verified", { owner: _customer });
            return _customer;
        });
    }
    resetPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield CustomerService.checkCustomerExists(input.customer_id)))
                throw (0, utils_1.createError)("Customer not found", 404);
            const verification = yield this.authVerificationService.getResetToken(input.customer_id, valueObjects_1.AuthVerificationReason.ACCOUNT_PASSWORD_RESET, input.token, true);
            const _customer = yield password_service_1.default.addPassword(input.customer_id, input.password);
            yield Promise.all([
                this.authVerificationService.removeVerification(verification._id),
                libs_1.NourishaBus.emit("customer:password:reset", { owner: _customer }),
            ]);
            return _customer;
        });
    }
    findByLogin(email, password, admin = false) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const where = { email };
            if (!admin)
                Object.assign(where, { primary_role: "customer" });
            const acc = yield models_1.customer.findOne(where).lean().exec();
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            if (!!((_a = acc === null || acc === void 0 ? void 0 : acc.control) === null || _a === void 0 ? void 0 : _a.suspended))
                throw (0, utils_1.createError)("Customer suspended, please contact the administrator", 404);
            const roles = (_c = ((_b = acc === null || acc === void 0 ? void 0 : acc.roles) !== null && _b !== void 0 ? _b : [])) === null || _c === void 0 ? void 0 : _c.map((role) => String(role));
            if (admin && !(yield role_service_1.RoleService.isAdmin(roles)))
                throw (0, utils_1.createError)("❌ Access Denied", 401);
            if (!(yield password_service_1.default.checkPassword(acc._id, password)))
                throw (0, utils_1.createError)("Incorrect email or password", 401);
            yield CustomerService.updateLastSeen(acc === null || acc === void 0 ? void 0 : acc._id);
            return acc;
        });
    }
    checkEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield models_1.customer.countDocuments({ email }).exec();
            return count > 0;
        });
    }
    static checkCustomerExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield models_1.customer.countDocuments({ _id: id }).exec();
            return count > 0;
        });
    }
    static updateLastSeen(customer_id, validate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = models_1.customer.findOneAndUpdate({ _id: customer_id }, { lastSeen: new Date() }, { new: true }).lean().exec();
            if (!acc && validate)
                throw (0, utils_1.createError)("Customer not found", 404);
            return;
        });
    }
    static removeUpdateForcedInputs(input) {
        return (0, utils_1.removeForcedInputs)(input, [
            "_id",
            "email",
            "createdAt",
            "updatedAt",
            "password",
            "is_email_verified",
            "control",
            "roles",
            "primary_role",
            "ref_code",
            "last_seen",
        ]);
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map