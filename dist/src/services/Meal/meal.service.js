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
exports.MealService = void 0;
const models_1 = require("../../models");
const role_service_1 = require("../../services/role.service");
const utils_1 = require("../../utils");
const valueObjects_1 = require("../../valueObjects");
class MealService {
    createMeal(dto, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateFields)(dto, ["name"]);
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.CREATE, valueObjects_1.PermissionScope.ALL]);
            const slug = (0, utils_1.createSlug)(dto.name);
            if (yield MealService.checkMealExists("slug", slug))
                throw (0, utils_1.createError)("Meal already exist", 400);
            const _meal = yield models_1.meal.create(Object.assign(Object.assign({}, dto), { slug }));
            return _meal;
        });
    }
    createMealPack(dto, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateFields)(dto, ["name", "meals", "image_url"]);
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.CREATE, valueObjects_1.PermissionScope.ALL]);
            const slug = (0, utils_1.createSlug)(dto.name);
            if (yield MealService.checkMealPackExists("slug", slug))
                throw (0, utils_1.createError)("Meal pack already exist", 400);
            const _meal_pack = yield models_1.mealPack.create(Object.assign(Object.assign({}, dto), { slug }));
            return _meal_pack;
        });
    }
    getMeals(roles, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            let queries = {};
            return yield (0, utils_1.paginate)("meal", queries, filters);
        });
    }
    getMealPacks(roles, filters) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            let queries = { is_available: (_a = filters === null || filters === void 0 ? void 0 : filters.is_available) !== null && _a !== void 0 ? _a : true };
            return yield (0, utils_1.paginate)("mealPack", queries, filters);
        });
    }
    getMealById(id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            const _meal = yield models_1.meal.findById(id).lean().exec();
            if (!_meal)
                throw (0, utils_1.createError)("Meal not found", 404);
            return _meal;
        });
    }
    getMealPackById(id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield role_service_1.RoleService.hasPermission(roles, valueObjects_1.AvailableResource.MEAL, [valueObjects_1.PermissionScope.READ, valueObjects_1.PermissionScope.ALL]);
            const _meal_pack = yield models_1.mealPack.findById(id).populate("meals").lean().exec();
            if (!_meal_pack)
                throw (0, utils_1.createError)("Meal pack not found", 404);
            return _meal_pack;
        });
    }
    static checkMealExists(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield models_1.meal.countDocuments({ [key]: value }).exec();
            return count > 0;
        });
    }
    static checkMealPackExists(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield models_1.meal.countDocuments({ [key]: value }).exec();
            return count > 0;
        });
    }
}
exports.MealService = MealService;
//# sourceMappingURL=meal.service.js.map