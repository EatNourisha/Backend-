import Stripe from "stripe";
import { Card, Customer, Plan, Subscription, card, customer, plan, subscription, transaction } from "../../models";
import { RoleService } from "../role.service";
import { createError, epochToCurrentTime, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import config from "../../config";
import { CreateCheckoutSessionDto, InitiateSubscriptionDto } from "../../interfaces";
import { CardService } from "./card.service";
import { SubscriptionService } from "./subscription.service";
import { TransactionService } from "./transaction.service";
import { TransactionReason, TransactionStatus } from "../../models/transaction";

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
      success_url: "https://nourisha.onrender.com/v1/success.html?session_id={CHECKOUT_SESSION_ID}",
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
      success_url: "https://nourisha.onrender.com/v1/success.html?session_id={CHECKOUT_SESSION_ID}",
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

  // This method creates an intent to collect customer's subscription payment details and then store the payment
  // method so it can be reused later.
  async initializeSubscription(customer_id: string, dto: InitiateSubscriptionDto, roles: string[]) {
    validateFields(dto, ["plan_id"]);
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    const _plan = await plan.findById(dto?.plan_id).lean<Plan>().exec();
    if (!_plan) throw createError("Plan does not exist", 404);

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
        reference: invoice?.number,
        reason: TransactionReason.SUBSCRIPTION,
        stripe_customer_id: sub?.customer,
      }),
    ]);

    const client_secret = payment_intent.client_secret;
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
      status: TransactionStatus.SUCCESSFUL,
      invoice_url: data?.hosted_invoice_url,
      invoice_download_url: data?.invoice_pdf,
    });
  }

  static async invoicePaymentFailed(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Invoice Payment Failed!", data);
    await TransactionService.updateTransaction(data?.customer!, {
      reference: data?.number,
      status: TransactionStatus.DECLINED,
      invoice_url: data?.hosted_invoice_url,
      invoice_download_url: data?.invoice_pdf,
    });
  }

  static async customerSubscriptionUpdated(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Customer subscription updated", data);

    const [_plan, _card] = await Promise.all([
      plan.findOne({ product_id: data?.plan?.product }).select("_id").lean<Plan>().exec(),
      card.findOne({ token: data?.default_payment_method }).select("_id").lean<Card>().exec(),
    ]);

    const sub = await SubscriptionService.createSubscription(data?.customer! as string, {
      stripe_id: data?.id!,
      start_date: epochToCurrentTime(data?.current_period_start!),
      end_date: epochToCurrentTime(data?.current_period_end!),
      status: data?.status!,
      plan: _plan?._id!,
      card: _card?._id!,
      next_billing_date: epochToCurrentTime(data?.current_period_end!), //TODO: (WIP) confirm if the next billing date is valid
    });


    await transaction.updateOne({ subscription_reference: data?.id, stripe_customer_id: data?.customer }, { item: sub?._id, plan: _plan?._id }).exec();

    console.log("Subscription data", { _plan, _card, sub });

    return sub;
  }

  static async customerSubscriptionDeleted(event: Stripe.Event) {
    const data = event.data.object as any;
    console.log("Customer subscription deleted", data);

    const sub = await subscription.findOne({ stripe_id: data?.id }).lean<Subscription>().exec();
    if (!sub || (!!sub && sub.status === "cancelled")) return;
    await subscription.updateOne({ _id: sub?._id }, { status: "cancelled" }).lean().exec();
  }
}
