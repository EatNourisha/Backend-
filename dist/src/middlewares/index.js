"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequests = exports.compressor = exports.deviceGuard = exports.authGuard = exports.handleError = exports.catchRequest = void 0;
const consola_1 = __importDefault(require("consola"));
var catchInvalidRequests_1 = require("./catchInvalidRequests");
Object.defineProperty(exports, "catchRequest", { enumerable: true, get: function () { return catchInvalidRequests_1.catchRequest; } });
Object.defineProperty(exports, "handleError", { enumerable: true, get: function () { return catchInvalidRequests_1.handleError; } });
var guards_1 = require("./guards");
Object.defineProperty(exports, "authGuard", { enumerable: true, get: function () { return guards_1.authGuard; } });
Object.defineProperty(exports, "deviceGuard", { enumerable: true, get: function () { return guards_1.deviceGuard; } });
var compression_1 = require("./compression");
Object.defineProperty(exports, "compressor", { enumerable: true, get: function () { return __importDefault(compression_1).default; } });
const logRequests = (req, _, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    const contentType = req.get("Content-Type");
    console.log("\n");
    consola_1.default.info(`${ip} calling ${req.method} ${url} Content type: ${contentType}`);
    next();
};
exports.logRequests = logRequests;
//# sourceMappingURL=index.js.map