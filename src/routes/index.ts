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
import GiftCardRouter from "./Billing/giftcard.routes";
import CustomerRouter from "./customer.routes";
import LineupRouter from "./Meal/lineup.routes";
import DeliveryRouter from "./Meal/delivery.routes";
import BillingRouter from "./Billing/billing.routes";
import DiscountRouter from "./Billing/discount.routes";
import ReviewRouter from "./Preference/review.routes";
import AllergyRouter from "./Preference/allergy.routes";
import TransactionRouter from "./Billing/transaction.routes";
import SubscriptionRouter from "./Billing/subscription.routes";
import NotificationRouter from "./Preference/notification.routes";
import AdminSettingsRouter from "./Preference/adminSettings.route";
import CountryRouter from "./countries.route";
import MobileUseRouter from "./mobileUse.routes";

import ReferralRouter from "./referral.routes";
import EarningsRouter from "./earnings.routes";

import { sendResponse } from "../utils";
// import config from "../config";

import config from "../config";
import { BillingHooks } from "../services";
import { authGuard } from "../middlewares";
import { Customer, Transaction, customer, giftpurchase, transaction, GiftPurchase } from "../models";
import { TransactionStatus } from "../models/transaction";

import AppUpdate from "./appupdate.routes";
import bodyParser from "body-parser";
import { GiftStatus } from "../models/giftPurchase";
import {sendGiftBought, sendGiftRecipient, sendGiftSent}  from "../services/giftCardEmail.service";
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
routes.use("/discounts", DiscountRouter);
routes.use("/allergies", AllergyRouter);
routes.use("/customers", CustomerRouter);
routes.use("/settings", AdminSettingsRouter);
routes.use("/transactions", TransactionRouter);
routes.use("/subscriptions", SubscriptionRouter);
routes.use("/notifications", NotificationRouter);
routes.use("/countries", CountryRouter);
routes.use("/referrals", ReferralRouter);
routes.use("/earnings", EarningsRouter);
routes.use("/deliveries", DeliveryRouter);
routes.use("/appupdate", AppUpdate);
routes.use("/mobileuse", MobileUseRouter);
routes.use("/gift", GiftCardRouter);

routes.get("/configs", authGuard, (_, res) => {
  return sendResponse(res, 200, config);
});

routes.get("/healthcheck", (_, res, __) => {
  sendResponse(res, 200, { message: "OK" });
});

routes.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res, __) => {
  const payload = req.body;
  const sig_header = req.headers["stripe-signature"] as string;

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(payload, sig_header, config.ENDPOINT_SECRET);
  } catch (error) {
    return sendResponse(res, 400, { message: error.message });
  }

  switch (event.type) {
    case "checkout.session.completed": {
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
      const data = event.data.object as any;
      const customerId = data?.customer;
      const cus = await customer.findOne({ stripe_id: customerId });
      const tx = await transaction
        .findOneAndUpdate({ reference: data?.id, stripe_customer_id: data?.customer }, { status: TransactionStatus.SUCCESSFUL })
        .lean<Transaction>()
        .exec();

      if (tx?.reason === "Gift-Card"|| "Custom-Gift") {
      const gift = await giftpurchase
          .findOneAndUpdate({ customer: cus?._id, reference: data?.id }, { status: GiftStatus.ACTIVE })
          .lean<GiftPurchase>()
          .exec();

          if(gift){
            console.log('~~~~~~~~~GIFT EMAILs SENT~~~~~~~~~~~~~~~~')
            await sendGiftBought(cus?.email!, gift, false )
            if(gift && gift?.scheduled !== true){
              await sendGiftRecipient(gift?.reciever_email!, gift, false )
              await sendGiftSent(cus?.email!, gift, false )
            }
            console.log('~~~~~~~~~END GIFT EMAILs~~~~~~~~~~~~~~~~')
          }

      }
      const meta = data.metadata;

      if(meta.couponCode !== null || ""){       
        await giftpurchase.findOneAndUpdate({ code: meta.couponCode }, { status: GiftStatus.REDEEMED, redeemed_by: cus?._id })
        .lean<GiftPurchase>()
        .exec();
    }

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
      await BillingHooks.paymentMethodAttached(event);
      break;
    }
    case "payment_method.detached": {
      await BillingHooks.paymentMethodDetached(event);
      break;
    }
    case "customer.subscription.created": {
      const data = event.data.object as any;
      const customerId = data?.customer;
      const cus = await customer.findOne({ stripe_id: customerId });
      await transaction
        .findOneAndUpdate(
          { subscription_reference: data?.id, stripe_customer_id: data?.customer },
          { status: TransactionStatus.SUCCESSFUL }
        )
        .lean<Transaction>()
        .exec();
      await customer.findOneAndUpdate({ _id: cus?._id }, { lineup: null }).lean<Customer>().exec();
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
