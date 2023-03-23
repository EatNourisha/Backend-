"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.catchRequest = void 0;
const consola_1 = __importDefault(require("consola"));
const catchRequest = (_, __, next) => {
    const err = new Error("Invalid endpoint");
    err.statusCode = 404;
    next(err);
};
exports.catchRequest = catchRequest;
const handleError = (err, req, res, _) => {
    const error = {};
    error.message = err.message;
    error.statusCode = err.statusCode ? err.statusCode : 500;
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    consola_1.default.error({
        errorUrl: url,
        message: err.message,
        statusCode: err.statusCode,
    });
    consola_1.default.error({
        stack: err.stack,
    });
    res.status(error.statusCode);
    res.json(error);
};
exports.handleError = handleError;
//# sourceMappingURL=catchInvalidRequests.js.map