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
exports.MealController = void 0;
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const service = new services_1.MealService();
class MealController {
    createMeal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, user } = req;
                const data = yield service.createMeal(body, user.roles);
                (0, utils_1.sendResponse)(res, 201, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    createMealPack(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, user } = req;
                const data = yield service.createMealPack(body, user.roles);
                (0, utils_1.sendResponse)(res, 201, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getMeals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, query } = req;
                const data = yield service.getMeals(user.roles, query);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getMealPacks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, query } = req;
                const data = yield service.getMealPacks(user.roles, query);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getMealById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params } = req;
                const data = yield service.getMealById(params.id, user.roles);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getMealPackById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params } = req;
                const data = yield service.getMealPackById(params.id, user.roles);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
}
exports.MealController = MealController;
//# sourceMappingURL=meal.controller.js.map