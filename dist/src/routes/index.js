"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const role_routes_1 = __importDefault(require("./role.routes"));
const meal_routes_1 = __importDefault(require("./Meal/meal.routes"));
const lineup_routes_1 = __importDefault(require("./Meal/lineup.routes"));
const customer_routes_1 = __importDefault(require("./customer.routes"));
const utils_1 = require("../utils");
const routes = (0, express_1.Router)();
routes.use("/auth", auth_routes_1.default);
routes.use("/meals", meal_routes_1.default);
routes.use("/roles", role_routes_1.default);
routes.use("/lineups", lineup_routes_1.default);
routes.use("/customers", customer_routes_1.default);
routes.get("/healthcheck", (_, res, __) => {
    (0, utils_1.sendResponse)(res, 200, { message: "OK" });
});
exports.default = routes;
//# sourceMappingURL=index.js.map