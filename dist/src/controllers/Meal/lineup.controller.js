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
exports.MealLineupController = void 0;
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const service = new services_1.MealLineupService();
class MealLineupController {
    createLineup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, user } = req;
                const data = yield service.createLineup(user.sub, body, user.roles);
                (0, utils_1.sendResponse)(res, 201, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    updateLineup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, user, params } = req;
                const data = yield service.updateLineup(user.sub, body, user.roles, Boolean(params === null || params === void 0 ? void 0 : params.dryRun));
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getCurrentCustomersLineup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const data = yield service.getCurrentCustomersLineup(user.sub, user.roles);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getTodaysLineup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const data = yield service.getTodaysLineup(user.sub, user.roles);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
    getUpcomingLineup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const data = yield service.getUpcomingLineup(user.sub, user.roles);
                (0, utils_1.sendResponse)(res, 200, data);
            }
            catch (error) {
                (0, utils_1.sendError)(error, next);
            }
        });
    }
}
exports.MealLineupController = MealLineupController;
//# sourceMappingURL=lineup.controller.js.map