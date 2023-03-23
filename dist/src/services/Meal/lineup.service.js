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
exports.MealLineupService = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const role_service_1 = require("../role.service");
const valueObjects_1 = require("../../valueObjects");
const date_fns_1 = require("date-fns");
const omit_1 = __importDefault(require("lodash/omit"));
const pick_1 = __importDefault(require("lodash/pick"));
const intersection_1 = __importDefault(require("lodash/intersection"));
class MealLineupService {
    createLineup(customer_id, dto, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateFields)(dto, ["monday", "tuesday", "wednesday", "thursday", "friday"]);
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            if (yield MealLineupService.checkLineupExists(customer_id))
                throw (0, utils_1.createError)("Customer's weekly lineup already exist", 400);
            const _lineup = yield models_1.lineup.create(Object.assign(Object.assign({}, dto), { customer: customer_id }));
            return _lineup;
        });
    }
    updateLineup(lineup_id, dto, roles, dryRun = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            const _lineup = yield models_1.lineup
                .findByIdAndUpdate(lineup_id, Object.assign({}, (0, omit_1.default)(dto, ["customer"])), { new: true })
                .lean()
                .exec();
            if (!_lineup && dryRun)
                throw (0, utils_1.createError)("Customer's weekly lineup does not exist", 404);
            return _lineup;
        });
    }
    getCurrentCustomersLineup(customer_id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            const pops = ["monday", "tuesday", "wednesday", "thursday", "friday"];
            const _lineup = yield models_1.lineup.findOne({ customer: customer_id }).populate(pops).lean().exec();
            if (!_lineup)
                throw (0, utils_1.createError)("Customer's weekly lineup does not exist", 404);
            return _lineup;
        });
    }
    getTodaysLineup(customer_id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const day_of_week_index = (0, date_fns_1.getDay)(new Date());
            const today = days[day_of_week_index];
            const pops = ["monday", "tuesday", "wednesday", "thursday", "friday"];
            const _lineup = yield models_1.lineup.findOne({ customer: customer_id }).populate(pops).lean().exec();
            if (!_lineup)
                throw (0, utils_1.createError)("Customer's weekly lineup does not exist", 404);
            if (!_lineup[today])
                throw (0, utils_1.createError)("You've got no meal today", 404);
            return _lineup[today];
        });
    }
    getUpcomingLineup(customer_id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const pops = ["monday", "tuesday", "wednesday", "thursday", "friday"];
            const day_of_week_index = (0, date_fns_1.getDay)(new Date());
            const _intersect = (0, intersection_1.default)((0, intersection_1.default)(days, pops), Array.from(days).splice(day_of_week_index + 1));
            const _lineup = yield models_1.lineup.findOne({ customer: customer_id }).populate(_intersect).lean().exec();
            if (!_lineup)
                throw (0, utils_1.createError)("Customer's weekly lineup does not exist", 404);
            return (0, pick_1.default)(_lineup, _intersect);
        });
    }
    static checkLineupExists(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield models_1.lineup.countDocuments({ customer: customer_id }).exec();
            return count > 0;
        });
    }
}
exports.MealLineupService = MealLineupService;
//# sourceMappingURL=lineup.service.js.map