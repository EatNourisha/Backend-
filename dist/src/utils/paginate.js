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
Object.defineProperty(exports, "__esModule", { value: true });
const access_service_1 = require("../services/access.service");
const defaultFilters = { limit: "10", page: "1" };
function paginate(schemaType, query = {}, filters = defaultFilters, options) {
    return __awaiter(this, void 0, void 0, function* () {
        filters = Object.assign(Object.assign({}, defaultFilters), filters);
        const model = access_service_1.AccessService.getModel(schemaType);
        const skip = Math.abs((Math.max(parseInt(filters === null || filters === void 0 ? void 0 : filters.page), 1) - 1) * parseInt(filters === null || filters === void 0 ? void 0 : filters.limit));
        const res = yield Promise.all([
            model.countDocuments(query).exec(),
            model
                .find(query, null, options)
                .lean()
                .sort({ createdAt: -1 })
                .limit(Math.abs(parseInt(filters === null || filters === void 0 ? void 0 : filters.limit)))
                .skip(skip)
                .exec(),
        ]);
        return { totalCount: res[0], data: res[1] };
    });
}
exports.default = paginate;
//# sourceMappingURL=paginate.js.map