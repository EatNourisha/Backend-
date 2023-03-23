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
exports.deviceGuard = exports.authGuard = void 0;
const consola_1 = __importDefault(require("consola"));
const services_1 = require("../services");
const utils_1 = require("../utils");
const authGuard = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authService = new services_1.AuthService();
    consola_1.default.info("Authenticating...");
    let token = (req.headers["x-access-token"] || req.headers.authorization);
    let deviceId = req.headers["device-id"];
    if (!token)
        return next((0, utils_1.createError)("Authorization field is missing", 401));
    if (!deviceId)
        return next((0, utils_1.createError)("deviceId header field is missing", 401));
    token = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    try {
        let payload = yield authService.validateAuthCode(token, deviceId);
        if (!payload)
            return next((0, utils_1.createError)("Authorization failed", 401));
        yield services_1.CustomerService.updateLastSeen(payload.sub);
        req.query.userId = payload.sub;
        req.user = payload;
        next();
    }
    catch (err) {
        next((0, utils_1.createStatusCodeError)(err, 401));
    }
});
exports.authGuard = authGuard;
const deviceGuard = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    let deviceId = req.headers["device-id"];
    if (!deviceId)
        return next((0, utils_1.createError)("deviceId header field is missing", 401));
    next();
});
exports.deviceGuard = deviceGuard;
//# sourceMappingURL=guards.js.map