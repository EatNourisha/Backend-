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
exports.AuthVerificationService = void 0;
const models_1 = require("../models");
const valueObjects_1 = require("../valueObjects");
const voucher_code_generator_1 = require("voucher-code-generator");
const utils_1 = require("../utils");
const addMinutes_1 = __importDefault(require("date-fns/addMinutes"));
const nanoid_1 = require("nanoid");
class AuthVerificationService {
    static generateCode() {
        const code = (0, voucher_code_generator_1.generate)({ charset: "1234567890", length: 5 })[0];
        return code;
    }
    static generateResetToken(customer_id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, nanoid_1.nanoid)(24);
            const exp = (0, addMinutes_1.default)(Date.now(), 60).getTime();
            return yield models_1.authVerification.findOneAndUpdate({ customer_id, reason }, { customer_id, reason, exp, token }, (0, utils_1.getUpdateOptions)());
        });
    }
    requestResetPassword(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reason = valueObjects_1.AuthVerificationReason.ACCOUNT_PASSWORD_RESET;
            let verification = yield this.getPreviousVerificationIfValid(customer_id, reason);
            if (!verification) {
                verification = yield AuthVerificationService.generateResetToken(customer_id, reason);
            }
            const acc = yield models_1.customer.findById(customer_id).lean().exec();
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            console.log("RESET TOKEN", `?token=${verification === null || verification === void 0 ? void 0 : verification.token}&sub=${customer_id}`);
            return verification;
        });
    }
    requestEmailVerification(customer_id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = 60;
            const acc = yield models_1.customer.findById(customer_id).lean().exec();
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            let verification = yield this.getPreviousVerificationIfValid(customer_id, reason);
            if (!verification) {
                const exp = (0, addMinutes_1.default)(Date.now(), timeout).getTime(), code = AuthVerificationService.generateCode();
                verification = yield models_1.authVerification.findOneAndUpdate({ customer_id, reason }, { customer_id, reason, exp, code }, (0, utils_1.getUpdateOptions)());
            }
            console.log("\nEMAIL VERIFICATION CODE", verification === null || verification === void 0 ? void 0 : verification.code);
            return verification;
        });
    }
    getResetToken(customer_id, reason, token, verify = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let verification = yield models_1.authVerification.findOne({ customer_id, reason }).select(["token", "exp"]).lean().exec();
            if (!verification)
                throw (0, utils_1.createError)("Reset token not requested", 400);
            if (Date.now() > (verification === null || verification === void 0 ? void 0 : verification.exp))
                throw (0, utils_1.createError)("Reset token has expired. Please request another one", 400);
            if (token !== verification.token)
                throw (0, utils_1.createError)("Invalid token", 400);
            if (verify) {
                const updatePayload = verify ? { verified: true } : {};
                verification = yield models_1.authVerification.findByIdAndUpdate(verification._id, updatePayload, { new: true }).lean().exec();
            }
            return verification;
        });
    }
    getEmailVerification(customer_id, reason, code, verify = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let verification = yield models_1.authVerification.findOne({ customer_id, reason }).select(["code", "exp"]).lean().exec();
            if (!verification)
                throw (0, utils_1.createError)("Verification not requested", 400);
            if (Date.now() > (verification === null || verification === void 0 ? void 0 : verification.exp))
                throw (0, utils_1.createError)("Verification has expired. Please request another one", 400);
            if (code !== verification.code)
                throw (0, utils_1.createError)("Incorrect code", 400);
            if (verify) {
                const updatePayload = verify ? { verified: true } : {};
                verification = yield models_1.authVerification.findByIdAndUpdate(verification._id, updatePayload, { new: true }).lean().exec();
            }
            return verification;
        });
    }
    removeVerification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield models_1.authVerification.findByIdAndDelete(id).select("_id").lean().exec());
        });
    }
    getPreviousVerificationIfValid(customer_id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const verification = yield models_1.authVerification
                .findOne({ customer_id, reason })
                .select(["exp", "code", "token"])
                .lean()
                .exec();
            if (!verification)
                return null;
            const hasExpired = Date.now() > (verification === null || verification === void 0 ? void 0 : verification.exp);
            return !hasExpired ? verification : null;
        });
    }
}
exports.AuthVerificationService = AuthVerificationService;
//# sourceMappingURL=authVerification.service.js.map