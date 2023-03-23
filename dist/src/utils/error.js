"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStatus = exports.createStatusCodeError = exports.createError = exports.sendError = void 0;
const errors_1 = require("request-promise/errors");
const sendError = (err, next) => {
    const error = new Error(err ? err.message : "A server error just occurred");
    error.statusCode =
        err && err.statusCode ? err.statusCode : 500;
    error.status = err.status || ErrorStatus.FAILED;
    next(error);
};
exports.sendError = sendError;
const createError = (message, statusCode, status) => {
    const error = new Error(message || "An unknown error has occurred");
    error.statusCode = statusCode || 500;
    error.status = status || ErrorStatus.FAILED;
    return error;
};
exports.createError = createError;
const createStatusCodeError = (err, statusCode) => {
    if (err instanceof errors_1.StatusCodeError)
        return (0, exports.createError)(err.error.message, statusCode || err.error.statusCode);
    else
        return (0, exports.createError)(err.message, statusCode || err.statusCode);
};
exports.createStatusCodeError = createStatusCodeError;
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus["SUCCESS"] = "success";
    ErrorStatus["FAILED"] = "failed";
})(ErrorStatus = exports.ErrorStatus || (exports.ErrorStatus = {}));
//# sourceMappingURL=error.js.map