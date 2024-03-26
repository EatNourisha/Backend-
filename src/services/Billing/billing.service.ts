import Stripe from "stripe";
import {
  Card,
  Customer,
  Order,
  Plan,
  PromoCode,
  Subscription,
  card,
  customer,
  order,
  plan,
  promoCode,
  subscription,
  transaction,
} from "../../models";
import { RoleService } from "../role.service";
import { createError, epochToCurrentTime, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import config from "../../config";
import { CreateCheckoutSessionDto, InitializePaymentDto, InitiateSubscriptionDto } from "../../interfaces";
import { CardService } from "./card.service";
import { SubscriptionService } from "./subscription.service";
import { TransactionService } from "./transaction.service";
import { Transaction, TransactionReason, TransactionStatus } from "../../models/transaction";
import { OrderService } from "./order.service";
import consola from "consola";
import { DiscountService } from "./discount.service";
import { when } from "../../utils/when";
import { ReferralService } from "../../services/referral.service";
import { MarketingService } from "../../services";

export class BillingService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async createCheckoutSession(customer_id: string, dto: CreateCheckoutSessionDto, roles: string[]) {
    validateFields(dto, ["price_id"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: cus?.stripe_id,
      line_items: [{ price: dto?.price_id, quantity: 1 }],
      payment_method_types: ["card"],
      success_url: "https://api.eatnourisha.com/v1/success.html?session_id={CHECKOUT_SESSION_ID}",
    });

    return session;
  }

  // This method creates an intent session to collect customer's payment details and then store the payment
  // method so it can be reused later.
  async createSetupIntentSession(customer_id: string, dto: CreateCheckoutSessionDto, roles: string[]) {
    validateFields(dto, ["price_id"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const session = await this.stripe.checkout.sessions.create({
      mode: "setup",
      customer: cus?.stripe_id,
      //   line_items: [{ price: dto?.price_id, quantity: 1 }],
      payment_method_types: ["card"],
      success_url: "https://api.eatnourisha.com/v1/success.html?session_id={CHECKOUT_SESSION_ID}",
    });

    return session;
  }

  // This method creates an intent to collect customer's payment details and then store the payment
  // method so it can be reused later.
  async createSetupIntent(customer_id: string, _: CreateCheckoutSessionDto, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const intent = await this.stripe.setupIntents.create({
      customer: cus?.stripe_id,
      usage: "off_session",
      payment_method_types: ["card"],
    });

    return { client_secret: intent.client_secret };
  }

  async initializePayment(customer_id: string, dto: InitializePaymentDto, roles?: string[]) {
    validateFields(dto, ["order_id"]);
    if (!!roles) await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const _order = await order.findById(dto?.order_id).lean<Order>().exec();
    if (!_order) throw createError("Order does not exist", 404);

    if (_order?.total < 1) throw createError("Order must have a price greater than zero", 409);
    const amount_off = _order?.actual_discounted_amount ?? 0;

    const intent = await this.stripe.paymentIntents.create({
      customer: cus?.stripe_id,
      payment_method: dto?.card_token,
      amount: Math.round((_order?.total - amount_off) * 100),
      currency: "gbp",
      off_session: !!dto?.card_token,
      receipt_email: cus?.email,
      expand: ["invoice"],
      confirm: !!dto?.card_token,
      metadata: {
        promo_id: _order?.promo,
        customer_id: _order?.customer,
        discount: amount_off,
      },
    });
    if (!!intent.id) {
      await transaction.create({
        itemRefPath: "Order",
        item: _order?._id,
        currency: intent.currency,
        order_reference: intent?.id,
        customer: cus?._id,
        amount: (intent.amount ?? 0) / 100,
        reference: intent?.id,
        payment_intent: intent?.id,
        reason: TransactionReason.ORDER,
        stripe_customer_id: cus?.stripe_id,
        applied_promo: _order?.promo,
      });
    }

    console.log("[Initialize Payment]", { dto, client_secret: intent?.client_secret });

    return { client_secret: intent?.client_secret };
  }

  // This method creates an intent to collect customer's subscription payment details and then store the payment
  // method so it can be reused later.
  async initializeSubscription(customer_id: string, dto: InitiateSubscriptionDto, roles: string[]) {
    validateFields(dto, ["plan_id"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const app_version = dto?.version?.replace(/\./g, '');

    if ((dto.os === "ios" || dto.os === "android") && app_version && parseInt(app_version, 10) < 155) {
      throw new Error('Please update your app to continue.');
    }

    await customer.updateOne({ customer_id }, { $unset: { lineup: 1 } });

    const cus = await customer.findById(customer_id).populate("pending_promo").lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const _plan = await plan.findById(dto?.plan_id).lean<Plan>().exec();
    if (!_plan) throw createError("Plan does not exist", 404);

    // one_off allows users to toggle auto charge
    dto.one_off = dto?.one_off ?? true;
    // cancels the subscription when it ends when set to true
    const cancel_at_period_end = !!dto?.one_off || !cus?.preference?.auto_renew;

    let promo: PromoCode = cus?.pending_promo as PromoCode;
    if (!cus?.pending_promo && !!dto?.promo_code) {
      promo = await promoCode.findOne({ "code": dto?.promo_code }).lean<PromoCode>().exec();
    }

    const promo_code = when(!!promo && promo?.active === true && !promo?.no_discount, promo?.stripe_id, undefined);

    const sub = await this.stripe.subscriptions.create({
      customer: cus?.stripe_id,
      default_payment_method: dto?.card_token,
      collection_method: "charge_automatically",
      items: [
        {
          price: _plan?.price_id,
          quantity: 1,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      cancel_at_period_end,
      promotion_code: promo_code,
    });

    const invoice = sub?.latest_invoice as Stripe.Invoice;
    const payment_intent = invoice?.payment_intent as Stripe.PaymentIntent;

    await Promise.all([
      transaction.create({
        itemRefPath: "Subscription",
        currency: sub?.currency,
        subscription_reference: sub?.id,
        customer: cus?._id,
        amount: (payment_intent?.amount ?? 0) / 100,
        payment_intent: payment_intent?.id,
        reference: invoice?.number,
        reason: TransactionReason.SUBSCRIPTION,
        stripe_customer_id: sub?.customer,
      }),
    ]);

    const client_secret = payment_intent?.client_secret;
    return { client_secret, subscription_id: sub?.id };
  }
}

export class BillingHooks {
  private static stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  static async setupIntentSucceeded(event: Stripe.Event) {
    const data = event.data.object as any;
    const pm = await this.stripe.paymentMethods.retrieve(data?.payment_method);
    if (!pm) return;
    console.log("SetupIntent Succeeded", data);

    const card = await CardService.createCard(
      pm?.customer! as string,
      {
        token: pm?.id,
        brand: pm?.card?.brand,
        country: pm.card?.country!,
        exp_month: pm?.card?.exp_month!,
        exp_year: pm?.card?.exp_year!,
        fingerprint: pm?.card?.fingerprint!,
        last4: pm?.card?.last4!,
        postal_code: pm?.billing_details?.address?.postal_code!,
      } as any
    );

    return card;
  }

  static async paymentIntentCreated(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Payment Intent Created", data);
  }

  static async paymentIntentSucceeded(tx: Transaction, event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Payment Intent Succeeded", data);
    try {
      switch (tx?.reason) {
        case "order":
          await OrderService.markOrderAsPaid(tx);
          break;
        default:
          break;
      }
    } catch (error) {
      consola.error(error?.message);
    }
  }

  static async paymentMethodAttached(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Payment method attached", data);
  }

  static async paymentMethodDetached(event: Stripe.Event) {
    const data = event.data.object as any;
    // console.log("Payment method detached", data);
    await CardService.detachCardHook(data.id);
  }

  static async customerSubscriptionCreated(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Customer subscription created", data);
  }

  static async invoicePaid(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Invoice Paid", data);

    await TransactionService.updateTransaction(data?.customer!, {
      reference: data?.number,
      payment_intent: data?.payment_intent,
      status: TransactionStatus.SUCCESSFUL,
      invoice_url: data?.hosted_invoice_url,
      invoice_download_url: data?.invoice_pdf,
      amount: data?.total / 100,
    });
  }

  static async invoicePaymentFailed(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Invoice Payment Failed!", data);
    await TransactionService.updateTransaction(data?.customer!, {
      reference: data?.number,
      payment_intent: data?.payment_intent,
      status: TransactionStatus.DECLINED,
      invoice_url: data?.hosted_invoice_url,
      invoice_download_url: data?.invoice_pdf,
      amount: data?.total / 100,
    });
  }

  static async customerSubscriptionUpdated(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Customer subscription updated", data);

    const [_plan, _card, cus] = await Promise.all([
      plan.findOne({ product_id: data?.plan?.product }).select(["_id", "name"]).lean<Plan>().exec(),
      card.findOne({ token: data?.default_payment_method }).select("_id").lean<Card>().exec(),
      customer
        .findOne({ stripe_id: data?.customer })
        .select(["_id", "email", "pending_promo", "address"])
        .populate("pending_promo")
        .lean<Customer>()
        .exec(),
    ]);

    const promo = cus?.pending_promo as PromoCode;

    const sub = await SubscriptionService.createSubscription(
      data?.customer! as string,
      {
        stripe_id: data?.id!,
        start_date: epochToCurrentTime(data?.current_period_start!),
        end_date: epochToCurrentTime(data?.current_period_end!),
        status: data?.status!,
        plan: _plan?._id!,
        card: _card?._id!,
        next_billing_date: epochToCurrentTime(data?.current_period_end!),
      },
      false
    );

    console.log("[customerSubscriptionUpdated]", { _plan, _card, cus });

    await Promise.all([
      transaction
        .updateOne({ subscription_reference: data?.id, stripe_customer_id: data?.customer }, { item: sub?._id, plan: _plan?._id })
        .exec(),

      customer.updateOne({ _id: cus?._id }, { subscription_status: data?.status }).lean<Customer>().exec(),
      MarketingService.updateContactSubscription(cus?.email, {
        plan_name: _plan?.name ?? "NO_PLAN",
        sub_status: data?.status,
        plan_type: "subscription",
        addr: cus?.address,
      }),
    ]);

    // if (data?.status === "active" && !!promo && !!cus?._id) {
    //   await Promise.all([
    //     !!_plan?._id && DiscountService.updateInfluencersReward(cus?._id!, _plan?._id!, promo),
    //     !!sub && !!_plan?._id && ReferralService.updateSubscribersInvite(cus?._id, _plan?._id),
    //     customer.updateOne({ _id: cus?._id }, { pending_promo: null }).exec(),
    //   ]);
    // }

    if (data?.status === "active" && !!cus?._id) {
      let to_run = [customer.updateOne({ _id: cus?._id }, { pending_promo: null }).exec()] as any[];
      if (!!_plan?._id) {
        to_run = [
          ...to_run,
          !!promo && DiscountService.updateInfluencersReward(cus?._id!, _plan?._id!, promo),
          ReferralService.updateSubscribersInvite(cus?._id, _plan?._id),
        ];
      }

      await Promise.all(to_run);
    }

    console.log("Subscription data", { _plan, _card, sub });
    return sub;
  }

  static async customerSubscriptionDeleted(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Customer subscription deleted", data);

    const sub = await subscription.findOne({ stripe_id: data?.id }).lean<Subscription>().exec();
    if (!sub || (!!sub && sub.status === "cancelled") || (!!sub && sub?.is_assigned_by_admin)) return;
    // await subscription.updateOne({ _id: sub?._id }, { status: "cancelled" }).lean().exec();
    await SubscriptionService.updateSubscription(sub?._id!, { status: "cancelled" });
  }
}
