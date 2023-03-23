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
exports.AccessService = void 0;
const utils_1 = require("../utils");
const models_1 = require("../models");
const capitalize_1 = __importDefault(require("lodash/capitalize"));
const consola_1 = __importDefault(require("consola"));
class AccessService {
    static documentBelongsToAccount(customer_id, docId, schema, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.getModel(schema).findById(docId).select("account").lean().exec();
            if (!doc)
                throw (0, utils_1.createError)(`${(0, capitalize_1.default)(schema)} not found`, 404);
            if (Boolean(String(key ? doc[key] : doc.account) !== customer_id)) {
                consola_1.default.error(`Access denied - ${schema}_${docId} does not belong to the account_${customer_id}`);
                throw (0, utils_1.createError)("Access denied", 401);
            }
            return Boolean(String(doc.account) === customer_id);
        });
    }
    static getModel(schema) {
        const map = { customer: models_1.customer, meal: models_1.meal, mealPack: models_1.mealPack };
        return map[schema];
    }
}
exports.AccessService = AccessService;
//# sourceMappingURL=access.service.js.map