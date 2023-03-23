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
exports.AuthService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../utils");
const models_1 = require("../models");
const services_1 = require("../services");
const config_1 = __importDefault(require("../config"));
const valueObjects_1 = require("../valueObjects");
const libs_1 = require("../libs");
class AuthService {
    constructor() {
        this.customerService = new services_1.CustomerService();
    }
    login(data, device_id, admin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DEVICE ID", device_id);
            const acc = yield this.customerService.findByLogin(data.email, data.password, admin);
            const payload = AuthService.transformUserToPayload(acc);
            const { token, expiration } = yield this.addToken(payload, device_id);
            payload.exp = expiration;
            yield libs_1.NourishaBus.emit("customer:logged_in", { owner: acc });
            return { payload, token };
        });
    }
    register(data, device_id, roles, isAdminReg = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.customerService.checkEmailExists(data.email))
                throw (0, utils_1.createError)("Email already exist", 400);
            const acc = yield this.customerService.createCustomer(data, roles, isAdminReg);
            const payload = AuthService.transformUserToPayload(acc);
            const { token, expiration } = yield this.addToken(payload, device_id);
            payload.exp = expiration;
            if (!isAdminReg)
                yield this.requestEmailVerification(acc === null || acc === void 0 ? void 0 : acc._id);
            return { payload, token };
        });
    }
    registerWithRole(data, role, device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateFields)(data, ["email", "first_name", "last_name", "password", "phone"]);
            if (yield this.customerService.checkEmailExists(data.email))
                throw (0, utils_1.createError)("Email already exist", 400);
            const _role = yield services_1.RoleService.getRoleBySlug(role);
            const acc = yield this.customerService.createCustomer(data, [_role === null || _role === void 0 ? void 0 : _role._id]);
            const payload = AuthService.transformUserToPayload(acc);
            const { token, expiration } = yield this.addToken(payload, device_id);
            payload.exp = expiration;
            console.log(`Registered new user with refCode ${acc === null || acc === void 0 ? void 0 : acc.ref_code}`);
            yield this.requestEmailVerification(acc === null || acc === void 0 ? void 0 : acc._id);
            return { payload, token };
        });
    }
    requestEmailVerification(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new services_1.AuthVerificationService().requestEmailVerification(customer_id, valueObjects_1.AuthVerificationReason.ACCOUNT_VERIFICATION);
            return { message: "Verification code sent" };
        });
    }
    verifyEmail(customer_id, code, roles, device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = yield this.customerService.verifyEmail({ customer_id, code }, roles);
            const payload = AuthService.transformUserToPayload(acc);
            const { token, expiration } = yield this.addToken(payload, device_id);
            payload.exp = expiration;
            return { payload, token };
        });
    }
    validateAuthCode(token, device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = yield models_1.authToken.findOne({ token, device_id }).select("token").lean().exec();
            if (!auth)
                throw (0, utils_1.createError)("Authorization code is invalid", 401);
            const payload = (0, jsonwebtoken_1.verify)(auth.token, config_1.default.JWT_SECRET, {
                audience: config_1.default.JWT_AUDIENCE,
            });
            if (Date.now() > payload.exp)
                throw (0, utils_1.createError)("Token expired", 401);
            return payload;
        });
    }
    requestResetPasswordToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = yield models_1.customer.findOne({ email }).select("_id").lean().exec();
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            yield new services_1.AuthVerificationService().requestResetPassword(acc._id);
            return { message: "Reset link has been sent to your email" };
        });
    }
    resetPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = yield this.customerService.resetPassword(input);
            yield AuthService.invalidateAuthCode(input.customer_id);
            return acc;
        });
    }
    static invalidateAuthCode(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield models_1.authToken.findOneAndUpdate({ customer_id }, { token: "", exp: 0 }).select("_id").lean().exec());
        });
    }
    addToken(payload, device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwt = AuthService.generateToken(payload);
            yield models_1.authToken
                .findOneAndUpdate({ customer_id: payload.sub, device_id }, {
                token: jwt.token,
                last_login: new Date(),
                exp: jwt.expiration,
                device_id,
            }, (0, utils_1.getUpdateOptions)())
                .lean()
                .exec();
            return jwt;
        });
    }
    static generateToken(payload) {
        const expiration = (0, utils_1.setExpiration)(14);
        const token = (0, jsonwebtoken_1.sign)(Object.assign({}, payload), config_1.default.JWT_SECRET, {
            audience: config_1.default.JWT_AUDIENCE,
            expiresIn: expiration,
        });
        return { token, expiration };
    }
    static transformUserToPayload(acc) {
        return {
            sub: acc._id,
            email: acc.email,
            roles: acc.roles,
            is_verified: acc === null || acc === void 0 ? void 0 : acc.is_email_verified,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map