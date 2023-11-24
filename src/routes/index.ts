// import crypto from "crypto";
import { Stripe } from "stripe";
import { Router } from "express";

import AuthRouter from "./auth.routes";
import RoleRouter from "./role.routes";
import MealRouter from "./Meal/meal.routes";
import PlanRouter from "./Billing/plan.routes";
import CardRouter from "./Billing/card.routes";
import CartRouter from "./Billing/cart.routes";
import OrderRouter from "./Billing/order.routes";
import CustomerRouter from "./customer.routes";
import LineupRouter from "./Meal/lineup.routes";
import DeliveryRouter from "./Meal/delivery.routes";
import BillingRouter from "./Billing/billing.routes";
import ReviewRouter from "./Preference/review.routes";
import AllergyRouter from "./Preference/allergy.routes";
import TransactionRouter from "./Billing/transaction.routes";
import SubscriptionRouter from "./Billing/subscription.routes";
import NotificationRouter from "./Preference/notification.routes";
import AdminSettingsRouter from "./Preference/adminSettings.route";

import ReferralRouter from "./referral.routes";
import EarningsRouter from "./earnings.routes";

import { sendResponse } from "../utils";
// import config from "../config";

import config from "../config";
import { BillingHooks } from "../services";
import { authGuard } from "../middlewares";
import { Transaction, transaction } from "../models";
import { TransactionStatus } from "../models/transaction";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

const routes = Router();

routes.use("/auth", AuthRouter);
routes.use("/meals", MealRouter);
routes.use("/plans", PlanRouter);
routes.use("/cards", CardRouter);
routes.use("/cart", CartRouter);
routes.use("/orders", OrderRouter);
routes.use("/roles", RoleRouter);
routes.use("/reviews", ReviewRouter);
routes.use("/lineups", LineupRouter);
routes.use("/billings", BillingRouter);
routes.use("/allergies", AllergyRouter);
routes.use("/customers", CustomerRouter);
routes.use("/settings", AdminSettingsRouter);
routes.use("/transactions", TransactionRouter);
routes.use("/subscriptions", SubscriptionRouter);
routes.use("/notifications", NotificationRouter);

routes.use("/referrals", ReferralRouter);
routes.use("/earnings", EarningsRouter);
routes.use("/deliveries", DeliveryRouter);

routes.get("/configs", authGuard, (_, res) => {
  return sendResponse(res, 200, config);
});

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

  const data = event.data.object as any;
  const tx = await transaction
    .findOneAndUpdate({ reference: data.id, stripe_customer_id: data?.customer }, { status: TransactionStatus.SUCCESSFUL })
    .lean<Transaction>()
    .exec();

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
    case "payment_intent.created": {
      await BillingHooks.paymentIntentCreated(event);
      break;
    }
    case "payment_intent.succeeded": {
      await BillingHooks.paymentIntentSucceeded(tx, event);
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
