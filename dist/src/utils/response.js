"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const consola_1 = __importDefault(require("consola"));
const error_1 = require("./error");
const sendResponse = (res, statusCode, result, message) => {
    result = result || { statusCode: 204, status: "success" };
    if (typeof result !== "object")
        result = result.toObject();
    result = { data: result };
    result.statusCode = result.statusCode || statusCode;
    result.status = error_1.ErrorStatus.SUCCESS;
    result.messsage = message;
    res.header("Cache-Control", "no-cache,no-supplier,must-revalidate");
    res.status(result.statusCode || statusCode || 200);
    res.json(result);
    consola_1.default
        .withTag(result.statusCode || statusCode || 200)
        .success(`Sent Response`);
    console.log("\n");
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=response.js.map