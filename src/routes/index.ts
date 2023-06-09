// import crypto from "crypto";
import { Stripe } from "stripe";
import { Router } from "express";

import AuthRouter from "./auth.routes";
import RoleRouter from "./role.routes";
import MealRouter from "./Meal/meal.routes";
import PlanRouter from "./Billing/plan.routes";
import CardRouter from "./Billing/card.routes";
import CustomerRouter from "./customer.routes";
import LineupRouter from "./Meal/lineup.routes";
import BillingRouter from "./Billing/billing.routes";
import AllergyRouter from "./Preference/allergy.routes";
import TransactionRouter from "./Billing/transaction.routes";
import SubscriptionRouter from "./Billing/subscription.routes";
import NotificationRouter from "./Preference/notification.routes";

import { sendResponse } from "../utils";
// import config from "../config";

import config from "../config";
import { BillingHooks } from "../services";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

const routes = Router();

routes.use("/auth", AuthRouter);
routes.use("/meals", MealRouter);
routes.use("/plans", PlanRouter);
routes.use("/cards", CardRouter);
routes.use("/roles", RoleRouter);
routes.use("/lineups", LineupRouter);
routes.use("/billings", BillingRouter);
routes.use("/allergies", AllergyRouter);
routes.use("/customers", CustomerRouter);
routes.use("/transactions", TransactionRouter);
routes.use("/subscriptions", SubscriptionRouter);
routes.use("/notifications", NotificationRouter);
// routes.use("/transactions", TransactionRouter);
// routes.use("/notifications", NotificationRouter);

routes.get("/healthcheck", (_, res, __) => {
  sendResponse(res, 200, { message: "OK" });
});

routes.post("/webhook", async (req, res, __) => {
  const payload = req.body;
  const sig_header = req.headers["stripe-signature"] as string;
  // console.log("Sig header", sig_header, payload)

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(payload, sig_header, config.ENDPOINT_SECRET);
  } catch (error) {
    // console.log("Error", error);
    return sendResponse(res, 400, { message: error.message });
  }
  // console.log("Stripe Event", event);
  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Checkout Session", event);
      break;
    }
    case "setup_intent.succeeded": {
      await BillingHooks.setupIntentSucceeded(event);
      break;
    }
    case "invoice.paid": {
      await BillingHooks.invoicePaid(event);
      break;
    }
    case "invoice.payment_failed": {
      // console.log("Invoice Payment Failed!", event);
      await BillingHooks.invoicePaymentFailed(event);
      break;
    }
    case "payment_method.attached": {
      console.log("Payment Method Attached!", event);
      await BillingHooks.paymentMethodAttached(event);
      break;
    }
    case "payment_method.detached": {
      await BillingHooks.paymentMethodDetached(event);
      break;
    }
    case "customer.subscription.created": {
      await BillingHooks.customerSubscriptionCreated(event);
      break;
    }
    case "customer.subscription.updated": {
      await BillingHooks.customerSubscriptionUpdated(event);
      break;
    }
    case "customer.subscription.deleted": {
      await BillingHooks.customerSubscriptionDeleted(event);
      break;
    }
    default: {
      break;
    }
  }
  return sendResponse(res, 200, { message: "OK" });
});

export default routes;
