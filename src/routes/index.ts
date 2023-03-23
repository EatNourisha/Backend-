// import crypto from "crypto";
import { Router } from "express";

import AuthRouter from "./auth.routes";
import RoleRouter from "./role.routes";
import MealRouter from "./Meal/meal.routes";
import LineupRouter from "./Meal/lineup.routes";
import CustomerRouter from "./customer.routes";

import { sendResponse } from "../utils";
// import config from "../config";

const routes = Router();

routes.use("/auth", AuthRouter);
routes.use("/meals", MealRouter);
routes.use("/roles", RoleRouter);
routes.use("/lineups", LineupRouter);
routes.use("/customers", CustomerRouter);
// routes.use("/transactions", TransactionRouter);
// routes.use("/notifications", NotificationRouter);

routes.get("/healthcheck", (_, res, __) => {
  sendResponse(res, 200, { message: "OK" });
});

export default routes;
