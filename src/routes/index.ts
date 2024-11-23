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
import CsTeamRouter from "./Marketing/csTeam.routes";

import { sendResponse } from "../utils";
// import config from "../config";

import config from "../config";
import { BillingHooks, sendOrderAlert } from "../services";
// import { authGuard } from "../middlewares";
import { Customer, Transaction, customer, giftpurchase, transaction, promoCode, lineup, order, subscription } from "../models";
// import { Customer, Transaction, customer, giftpurchase, transaction, GiftPurchase, promoCode, lineup, order, subscription } from "../models";
import { TransactionStatus } from "../models/transaction";

import AppUpdate from "./appupdate.routes";
import bodyParser from "body-parser";
import { GiftStatus } from "../models/giftPurchase";
import {sendGiftBought, sendGiftRecipient, sendGiftSent}  from "../services/giftCardEmail.service";
import axios from "axios";
import { OrderStatus } from "../models/order";
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
routes.use("/cs", CsTeamRouter);

// routes.get("/configs", authGuard, (_, res) => {
//   return sendResponse(res, 200, config);
// });

routes.get("/healthcheck", (_, res, __) => {
  console.log('Health Check Health Check Health Check')
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
      axios.post('https://hooks.zapier.com/hooks/catch/3666010/2mesl25/')
      .then(response => {
        console.log('ZAPIER EVENT FOR SUB - INTENT CREATED', response.data);
      })
      .catch(error => {
        console.log('There was an error making the request!', error);
      });
  
      await BillingHooks.paymentIntentCreated(event);
      break;
    }
    // case "payment_intent.succeeded": {
    //   const data = event.data.object as any;
    //   const customerId = data?.customer;
    //   const cus = await customer.findOne({ stripe_id: customerId });
    //   const tx = await transaction
    //     .findOneAndUpdate({ reference: data?.id, stripe_customer_id: data?.customer }, { status: TransactionStatus.SUCCESSFUL })
    //     .lean<Transaction>()
    //     .exec();

    //   if (tx?.reason === "Gift-Card"|| "Custom-Gift") {
    //   const gift = await giftpurchase
    //       .findOneAndUpdate({ customer: cus?._id, reference: data?.id }, { status: GiftStatus.ACTIVE })
    //       .lean<GiftPurchase>()
    //       .exec();

    //       if(gift){
    //         await sendGiftBought(cus?.email!, gift )
    //         if(gift?.scheduled === false && gift?.scheduled_Email === false){
    //           await sendGiftRecipient(gift?.reciever_email!, gift)
    //           await sendGiftSent(cus?.email!, gift)
    //           await giftpurchase.findOneAndUpdate({_id: gift?._id}, {scheduled_Email: true}).lean<GiftPurchase>()
    //           .exec()
    //         }}

    //   }

    //   const trans = await transaction.findOne({subscription_reference: data?.id, stripe_customer_id: data?.customer}).lean<Transaction>().exec();

    //   if (trans?.applied_promo !== null) {
    //     const promo = await promoCode.findById(trans?.applied_promo).exec();

    //   if (promo) {
    //   await promoCode.updateOne({ $push: { redeemed_by: cus?._id }}).exec();
    //       // const updatedRedemptions = Math.max((promo.max_redemptions || 0) - 1, 0);
    //       // await promoCode.updateOne({ _id: promo?._id }, { max_redemptions: updatedRedemptions }).exec();
    //   }
    //   }

    //   const meta = data.metadata;

    //   if(meta.couponCode !== null || ""){       
    //     await giftpurchase.findOneAndUpdate({ code: meta.couponCode }, { status: GiftStatus.REDEEMED, redeemed_by: cus?._id })
    //     .lean<GiftPurchase>()
    //     .exec();
    // }

    // if (trans.status === 'successful' && trans.itemRefPath === 'Order') {
    //   if (cus) {
    //     cus.newUser = false
    //     // Initialize or update POSTSUBEEMAILS with default values (all false)
    //     cus.POSTSUBEEMAILS = Object.assign({
    //       postsub0: false, postsub1: false, postsub2: false, postsub3: false,
    //       postsub4: false, postsub5: false, postsub6: false,
    //       postsub7: false, postsub8: false, postsub9: false,
    //       postsub10: false, postsub11: false,
    //       postsub12: false, postsub13: false
    //     }, cus.POSTSUBEEMAILS || {});
  
    //     // Initialize or update CARTEMAILS with default values (all false)
    //     cus.CARTEMAILS = Object.assign({
    //       cart1: false, cart2: false, cart3: false,
    //       cart4: false, cart5: false, cart6: false,
    //       cart7: false, cart8: false, cart9: false,
    //       cart10: false, cart11: false
    //     }, cus.CARTEMAILS || {});
  
    //     // Initialize or update REENGAGEEMAILS with default values (all false)
    //     cus.REENGAGEEMAILS = Object.assign({
    //       reengage1: false, reengage2: false, reengage3: false,
    //       reengage4: false, reengage5: false, reengage6: false
    //     }, cus.REENGAGEEMAILS || {});  
    
    //     cus.newUser = false
    //     await cus.save();
    //   }  

    //   if(cus){
    //     cus.newUser = false
    //     await cus?.save()
    //   }

    // }  
  

    // axios.post('https://hooks.zapier.com/hooks/catch/3666010/2mesl25/')
    // .then(response => {
    //   console.log('ZAPIER EVENT', response.data);
    // })
    // .catch(error => {
    //   console.log('There was an error making the request!', error);
    // });

    //   await BillingHooks.paymentIntentSucceeded(tx, event);
    //   break;
    // }

    case "payment_intent.succeeded": {
      try {
        const data = event.data.object as any;
        const customerId = data?.customer;
    
        const cus = await customer.findOne({ stripe_id: customerId });
        const tx = await transaction
          .findOneAndUpdate(
            { reference: data?.id, stripe_customer_id: data?.customer },
            { status: TransactionStatus.SUCCESSFUL }
          )
          .exec();
              

          if (tx?.reason as unknown === "Gift-Card" || tx?.reason as unknown === "Custom-Gift") {
            const gift = await giftpurchase
            .findOneAndUpdate(
              { customer: cus?._id, reference: data?.id },
              { status: GiftStatus.ACTIVE }
            )
            .exec();
    
          if (gift) {
            await sendGiftBought(cus?.email!, gift);
    
            if (!gift.scheduled && !gift.scheduled_Email) {
              await sendGiftRecipient(gift.reciever_email!, gift);
              await sendGiftSent(cus?.email!, gift);
              await giftpurchase
                .findOneAndUpdate(
                  { _id: gift._id },
                  { scheduled_Email: true }
                )
                .exec();
            }
          }
        }
    
        const trans = await transaction
          .findOne({
            subscription_reference: data?.id,
            stripe_customer_id: data?.customer,
          })
          .exec();
    
        if (trans?.applied_promo) {
          const promo = await promoCode.findById(trans.applied_promo).exec();
          if (promo) {
            await promoCode.updateOne(
              { _id: promo._id },
              { $push: { redeemed_by: cus?._id } }
            ).exec();
          }
        }
    
        const meta = data.metadata;
        if (meta.couponCode) {
          await giftpurchase
            .findOneAndUpdate(
              { code: meta.couponCode },
              { status: GiftStatus.REDEEMED, redeemed_by: cus?._id }
            )
            .exec();
        }

        if(cus){
          cus.newUser = false;
          await cus.save()
        }
    
        // if (trans?.status === "successful" && trans.itemRefPath === "Order") {
        //   if (cus) {
        //     cus.newUser = false;
        //     cus.POSTSUBEEMAILS = {
        //       ...Array(14).fill(false).reduce((acc, _, idx) => ({
        //         ...acc,
        //         [`postsub${idx}`]: false,
        //       })),
        //       ...cus.POSTSUBEEMAILS,
        //     };
        //     cus.CARTEMAILS = {
        //       ...Array(11).fill(false).reduce((acc, _, idx) => ({
        //         ...acc,
        //         [`cart${idx + 1}`]: false,
        //       })),
        //       ...cus.CARTEMAILS,
        //     };
        //     cus.REENGAGEEMAILS = {
        //       ...Array(6).fill(false).reduce((acc, _, idx) => ({
        //         ...acc,
        //         [`reengage${idx + 1}`]: false,
        //       })),
        //       ...cus.REENGAGEEMAILS,
        //     };
    
        //     await cus.save();
        //   }
        // }


      if (cus) {
        cus.newUser = false
        // Initialize or update POSTSUBEEMAILS with default values (all false)
        cus.POSTSUBEEMAILS = Object.assign({
          postsub0: false, postsub1: false, postsub2: false, postsub3: false,
          postsub4: false, postsub5: false, postsub6: false,
          postsub7: false, postsub8: false, postsub9: false,
          postsub10: false, postsub11: false,
          postsub12: false, postsub13: false
        }, cus.POSTSUBEEMAILS || {});
  
        // Initialize or update CARTEMAILS with default values (all false)
        cus.CARTEMAILS = Object.assign({
          cart1: false, cart2: false, cart3: false,
          cart4: false, cart5: false, cart6: false,
          cart7: false, cart8: false, cart9: false,
          cart10: false, cart11: false
        }, cus.CARTEMAILS || {});
  
        // Initialize or update REENGAGEEMAILS with default values (all false)
        cus.REENGAGEEMAILS = Object.assign({
          reengage1: false, reengage2: false, reengage3: false,
          reengage4: false, reengage5: false, reengage6: false
        }, cus.REENGAGEEMAILS || {});  
        await cus.save()
      }


        if(cus && cus?.newUser === true){
          cus.newUser = false;
          await cus.save()
        }

        const emails = [
          'zubytradecoin@gmail.com',
          'shukazuby@gmail.com',
          // 'codelifezu@gmail.com'
    
        ]

        const _ord = await order.findOne({customer: cus?._id}).sort({createdAt: -1})
    
        const payload = {
          deliveryDate: _ord?.delivery_date,
          subject: ` New Order: Single/Bulk Order has been Added by ${cus?.first_name} ${cus?.last_name}`,
        }

        if(_ord?.status === 'payment_received'){
          await sendOrderAlert( emails, payload)
          console.log('Kitchen Email Sent to Admins - Web Email', 
            `Single/Bulk Order has been Added by ${cus?.first_name} ${cus?.last_name}`)
        }
    
    
    
        await axios
          .post("https://hooks.zapier.com/hooks/catch/3666010/2mesl25/")
          .then((response) => console.log("ZAPIER EVENT", response.data))
          .catch((error) =>
            console.error("There was an error making the request!", error)
          );
    
        await BillingHooks.paymentIntentSucceeded(tx as Transaction, event);
      } catch (error) {
        console.error("Error handling payment_intent.succeeded:", error);
      }
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
      // await transaction
      //   .findOneAndUpdate(
      //     { subscription_reference: data?.id, stripe_customer_id: data?.customer },
      //     { status: TransactionStatus.SUCCESSFUL }
      //   )
      //   .lean<Transaction>()
      //   .exec();

      await customer.findOneAndUpdate({ _id: cus?._id }, { lineup: null }).lean<Customer>().exec();

      await lineup.updateMany({ customer: cus?._id , week: 1 },{ $set: { status: 'deactivated' } }, { multi: true }).exec();
      
      await BillingHooks.customerSubscriptionCreated(event);
      break;
    }
    case "customer.subscription.updated": {
      const data = event.data.object as any;
      const customerId = data?.customer;
      const cus = await customer.findOne({ stripe_id: customerId });

      const trans = await transaction.findOne({subscription_reference: data?.id, stripe_customer_id: data?.customer}).lean<Transaction>().exec();

      if (trans?.applied_promo !== null) {
        const promo = await promoCode.findById(trans?.applied_promo).exec();

        if (promo) {
        const updatedRedemptions = Math.max((promo.max_redemptions || 0) - 1, 0);
        await promoCode.updateOne({ _id: promo?._id },{ $set: { max_redemptions: updatedRedemptions }, $push: { redeemed_by: cus?._id }}).exec();
      }
    }
    
    const _ord = await order.findById(trans.item).exec()
    if(_ord){
      _ord.status = OrderStatus.PAID
      await _ord.save()
    }

    const orderExists = await order.exists({ customer: cus?._id, status: 'payment_received', delivery_date: {$lte: new Date()}});
    const lineupExists = await lineup.exists({ customer: cus?._id });

    let returning = false

    if (orderExists || lineupExists) {
      returning = true
    }

     await transaction.findOneAndUpdate({subscription_reference: data?.id, stripe_customer_id: data?.customer}, {status: TransactionStatus.SUCCESSFUL});


   await subscription.findOneAndUpdate({customer: cus?._id}, {returning_client: returning, used_sub: false})


   if (trans?.applied_promo !== null) {
     const promo = await promoCode.findById(trans?.applied_promo).exec();

   if (promo) {
   await promoCode.updateOne({ $push: { redeemed_by: cus?._id }}).exec();
   }
   }

   if (trans.status === 'successful' && trans.itemRefPath === 'Subscription') {
    if (cus) {
      cus.activeLineup = false;


      // Initialize or update POSTSUBEEMAILS with default values (all false)
      cus.POSTSUBEEMAILS = Object.assign({
        postsub0: false, postsub1: false, postsub2: false, postsub3: false,
        postsub4: false, postsub5: false, postsub6: false,
        postsub7: false, postsub8: false, postsub9: false,
        postsub10: false, postsub11: false,
        postsub12: false, postsub13: false
      }, cus.POSTSUBEEMAILS || {});

      // Initialize or update CARTEMAILS with default values (all false)
      cus.CARTEMAILS = Object.assign({
        cart1: false, cart2: false, cart3: false,
        cart4: false, cart5: false, cart6: false,
        cart7: false, cart8: false, cart9: false,
        cart10: false, cart11: false
      }, cus.CARTEMAILS || {});

      // Initialize or update REENGAGEEMAILS with default values (all false)
      cus.REENGAGEEMAILS = Object.assign({
        reengage1: false, reengage2: false, reengage3: false,
        reengage4: false, reengage5: false, reengage6: false
      }, cus.REENGAGEEMAILS || {});

       cus.newUser = false  
      await cus.save();
    }

    if(cus){
      cus.newUser = false
      await cus?.save()
    }


  }


  if(cus && cus?.newUser === true){
    cus.newUser = false;
    await cus.save()

  }

      
    axios.post('https://hooks.zapier.com/hooks/catch/3666010/2mesl25/')
    .then(response => {
      console.log('ZAPIER EVENT FOR SUB', response.data);
    })
    .catch(error => {
      console.log('There was an error making the request!', error);
    });

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
