"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
axios_1.default.interceptors.response.use((response) => {
    return response;
}, function (error) {
    var _a;
    const errorData = Object.assign({}, (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
    return Promise.reject(errorData);
});
const makeRequest = (config) => {
    return axios_1.default.request(Object.assign({}, config));
};
exports.default = makeRequest;
//# sourceMappingURL=makeRequest.js.map