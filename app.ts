import express from "express";
import { mongoose } from "@typegoose/typegoose";
import cors from "cors";
import helmet from "helmet";
import { AuthPayload } from "interfaces";
import { logRequests, catchRequest, handleError, compressor } from "./src/middlewares";
import config from "./src/config";
import Routes from "./src/routes";
import SystemService from "./src/services/system.service";
import { EventManager } from "./src/libs";
import { closeWorkers, serverAdapter } from "./src/queues";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import { ensureLoggedIn } from "connect-ensure-login";
import { AuthService } from "./src/services";
import { connection } from "./src/queues/connection";
import addUserToKlaviyoList from "./src/klaviyo/klaviyo";
// import  startPromoCronJob  from "./src/services/Marketing/cron.service";

declare global {
  namespace Express {
    interface Request {
      customer: AuthPayload;
    }
  }
}

// setup express app
const app = express();

app.set("trust proxy", 1);

// Configure view engine to render EJS templates.

app.set("views", __dirname + "/src/views");
app.set("view engine", "ejs");



// setup middlewares

// The request/tracing handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(helmet());
app.use(compressor());

app.use("/v1/webhook", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequests);

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async function (email, password, cb) {
      // console.log("Login Attempt", username, password);
      // if (username === "bull" && password === "board") {
      //   return cb(null, { user: "bull-board" });
      // }
      if (!!email && !!password) {
        const result = new AuthService().login({ email, password }, "xx_nourisha_passport_agent", true);
        return cb(null, { user: result });
      }
      return cb(null, false);
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user: any, cb) => {
  cb(null, user);
});

app.use(session({ secret: config.JWT_SECRET, saveUninitialized: true, resave: true }));
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize({}));
app.use(passport.session({} as any));

app.get("/ui/login", (req, res) => {
  res.render("login", { invalid: req.query.invalid === "true" });
});

app.post("/ui/login", passport.authenticate("local", { failureRedirect: "/ui/login?invalid=true" }), (_, res) => {
  res.redirect("/que");
});

app.use("/que", ensureLoggedIn({ redirectTo: "/ui/login" }), serverAdapter.getRouter());

// setup routes
app.use("/v1", Routes);
app.get("/", (_, res) =>
  res.status(200).json({
    name: config.NAME,
    type: "API Service",
    version: config.VERSION,
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
    EventManager.subscribeEvents();

    await addUserToKlaviyoList();
    console.log(`\n🐕‍🦺 db connected on localhost:${config.PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }



  // startPromoCronJob();

  app.listen(config.PORT, () => {
    // app.use(Sentry.Handlers.errorHandler());
    process.on("uncaughtException", async (error) => {
      console.log("An Uncaught exception has occurred", error);
      EventManager.unsubscribeEvents();
      await closeWorkers();
      connection.disconnect();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("A SIG-INT has occurred");
      EventManager.unsubscribeEvents();
      await closeWorkers();
      connection.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("A SIG-TERM has occurred");
      EventManager.unsubscribeEvents();
      await closeWorkers();
      connection.disconnect();
      process.exit(0);
    });
    console.log(`🚀 ${config.NAME} service::v${config.VERSION} listening on http://localhost:${config.PORT}`);
  });
})(); // IIFE (Immediatly Invoked Function Express)
