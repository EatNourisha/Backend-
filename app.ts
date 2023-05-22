import express from "express";
import { mongoose } from "@typegoose/typegoose";
import cors from "cors";
import helmet from "helmet";
import { AuthPayload } from "interfaces";
import { logRequests, catchRequest, handleError, compressor } from "./src/middlewares";
import config from "./src/config";
import Routes from "./src/routes";
import SystemService from "./src/services/system.service";

declare global {
  namespace Express {
    interface Request {
      user: AuthPayload;
    }
  }
}

// setup express app
const app = express();

app.set("trust proxy", 1);

// setup middlewares

// The request/tracing handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(helmet());
app.use(compressor());

app.use("/v1/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

app.use(logRequests);

// setup routes
app.use("/v1", Routes);
app.get("/", (_, res) =>
  res.status(200).json({
    name: config.NAME,
    type: "API Service",
    version: config.VERSION,
  })
);

app.get("/health", (_, res) =>
  res.status(200).json({
    message: "The app is healthy",
  })
);

// catch 404 and forward to error handler
app.use(catchRequest);
app.use(handleError);

// listen and handle server requests
(async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.DB_URI, {});
    new SystemService().ensureSystemServices();
    // EventManager.subscribeEvents();

    console.log(`\n🐕‍🦺 db connected on localhost:${config.PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  app.listen(config.PORT, () => {
    // app.use(Sentry.Handlers.errorHandler());
    process.on("uncaughtException", async (error) => {
      console.log("An Uncaught exception has occurred", error);
      //   EventManager.unsubscribeEvents();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("A SIG-INT has occurred");
      //   EventManager.unsubscribeEvents();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("A SIG-TERM has occurred");
      //   EventManager.unsubscribeEvents();
      process.exit(0);
    });
    console.log(`🚀 ${config.NAME} service::v${config.VERSION} listening on http://localhost:${config.PORT}`);
  });
})(); // IIFE (Immediatly Invoked Function Express)
