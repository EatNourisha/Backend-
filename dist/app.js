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
const express_1 = __importDefault(require("express"));
const typegoose_1 = require("@typegoose/typegoose");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const middlewares_1 = require("./src/middlewares");
const config_1 = __importDefault(require("./src/config"));
const routes_1 = __importDefault(require("./src/routes"));
const system_service_1 = __importDefault(require("./src/services/system.service"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, middlewares_1.compressor)());
app.use(express_1.default.json());
app.use(middlewares_1.logRequests);
app.use("/v1", routes_1.default);
app.get("/", (_, res) => res.status(200).json({
    name: config_1.default.NAME,
    type: "API Service",
    version: config_1.default.VERSION,
}));
app.use(middlewares_1.catchRequest);
app.use(middlewares_1.handleError);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        typegoose_1.mongoose.set("strictQuery", true);
        yield typegoose_1.mongoose.connect(config_1.default.DB_URI, {});
        new system_service_1.default().ensureSystemServices();
        console.log(`\n🐕‍🦺 db connected on localhost:${config_1.default.PORT}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    app.listen(config_1.default.PORT, () => {
        process.on("uncaughtException", (error) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("An Uncaught exception has occurred", error);
            process.exit(0);
        }));
        process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("A SIG-INT has occurred");
            process.exit(0);
        }));
        process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("A SIG-TERM has occurred");
            process.exit(0);
        }));
        console.log(`🚀 ${config_1.default.NAME} service::v${config_1.default.VERSION} listening on http://localhost:${config_1.default.PORT}`);
    });
}))();
//# sourceMappingURL=app.js.map