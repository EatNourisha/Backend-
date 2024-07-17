import { RoleService } from "../role.service";
import { CreateOrderDto, IPaginationFilter, PaginatedDocument, PlaceOrderDto } from "../../interfaces";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { Cart, CartItem, Customer, Order, OrderItem, Transaction, cart, cartItem, customer, earnings, giftpurchase, order, orderItem, transaction } from "../../models";
import { createError, paginate, validateFields } from "../../utils";
import { BillingService } from "./billing.service";
import { OrderStatus } from "../../models/order";
import { TransactionReason, TransactionStatus } from "../../models/transaction";
import Stripe from "stripe";
import config from "../../config";
import { DiscountService } from "./discount.service";
import { when } from "../../utils/when";
// import { NourishaBus } from "../../libs";
import OrderEventListener from "../../listeners/order.listener";
import { MealService } from "../Meal/meal.service";
import { sendOrderPlacedEmail } from "../../services/authEmail.service";
// import { GiftStatus } from "../../models/giftPurchase";

export class OrderService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async getOrders(
    customer_id: string,
    roles: string[],
    filters: IPaginationFilter & { customer: string }
  ): Promise<PaginatedDocument<Order[]>> {
    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ, PermissionScope.ALL]);

    let query = {};
    let populate = [
      {
        path: "items",
        populate: {
          path: "item",
          model: "MealPack",
        },
      } as any,
    ];
    const is_admin = await RoleService.isAdmin(roles);
    if (!is_admin) Object.assign(query, { customer: customer_id });
    else if (is_admin) populate.push({ path: "customer" });

    if (is_admin && !!filters?.customer) Object.assign(query, { customer: filters.customer });
    return await paginate("order", query, filters, { populate });
  }

  async ascertainOrderPayments(roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.ORDER, [
      PermissionScope.UPDATE,
      PermissionScope.ALL,
    ]);

    const txs = await transaction
      .find({ reason: TransactionReason.ORDER, status: TransactionStatus.PENDING })
      .populate("item")
      .lean<Transaction[]>()
      .exec();

    const to_run = txs.map((tx) => this.ascertainOrderPayment(tx));
    await Promise.all(to_run);
    // return { tx: txs.length, done: true };

    return txs;
  }

  async ascertainOrderPayment(tx: Transaction) {
    if (!tx?.order_reference || [OrderStatus.RECEIVED, OrderStatus.DISPATCHED].includes((tx?.item as Order)?.status)) return;
    try {
      const pi = await this.stripe.paymentIntents.retrieve(tx.order_reference);
      if (pi?.status !== "succeeded") return;

      const new_tx = await transaction
        .findByIdAndUpdate(tx?._id!, { status: TransactionStatus.SUCCESSFUL }, { new: true })
        .lean<Transaction>()
        .exec();

      return await OrderService.markOrderAsPaid(new_tx);
    } catch (error) {}
  }

  async getOrderById(order_id: string, customer_id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ, PermissionScope.ALL]);

    const is_admin = await RoleService.isAdmin(roles);
    let query = { order: order_id, quantity: { $gt: 0 } };
    let populate_order = [] as string[];
    if (!is_admin) Object.assign(query, { customer: customer_id });
    else if (is_admin) populate_order.push("customer");

    const [_order, items] = await Promise.all([
      order.findById(order_id).populate(populate_order).lean<Order>().exec(),
      paginate<OrderItem[]>("orderItem", query, filters, { populate: ["item"] }),
    ]);

    return { order: _order, items };
  }

  async getOpenOrders(
    customer_id: string,
    roles: string[],
): Promise<Order[]> {

    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ]);

    const orders = await paginate("order", {customer: customer_id, delivery_date: { $gt: new Date() } });

    const typedOrdersData = orders.data as Order[];

    // const orderData ={Data: typedOrdersData, totalCount: typedOrdersData.length}
    return typedOrdersData;
}

  async getClosedOrders(
    customer_id: string,
    roles: string[],
): Promise<Order[]> {

    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ]);

    const orders = await paginate("order", {customer: customer_id, status:'payment_received', delivery_date: { $lt: new Date() } });

    const typedOrdersData = orders.data as Order[];

    // const orderData ={Data: typedOrdersData, totalCount: typedOrdersData.length}
    return typedOrdersData;
}


  async updateOrderStatus(order_id: string, customer_id: string, dto: { status: OrderStatus }, roles: string[]) {
    validateFields(dto, ["status"]);

    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.UPDATE, PermissionScope.ALL]);
    const is_admin = await RoleService.isAdmin(roles);

    const supported_statuses_for_admin = Object.values(OrderStatus);
    const supported_statuses_for_customers = [OrderStatus.RECEIVED];

    if (!is_admin && !supported_statuses_for_customers.includes(dto?.status))
      throw createError(`Valid statuses are: ${supported_statuses_for_customers.join(", ")}`);
    else if (is_admin && !supported_statuses_for_admin.includes(dto.status))
      throw createError(`Supported statuses are: ${supported_statuses_for_admin.join(", ")}`);

    let query = { _id: order_id };
    if (!is_admin) Object.assign(query, { customer: customer_id });
    const _order = await order.findOneAndUpdate(query, { status: dto.status }, { new: true }).lean<Order>().exec();
    return _order;
  }

  async placeOrder(customer_id: string, dto: PlaceOrderDto, roles: string[]) {
    validateFields(dto, ["cart_session_id", "delivery_date"]);
    if (!!dto?.delivery_address) validateFields(dto?.delivery_address, ["address_", "city", "country"]);

    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.CREATE, PermissionScope.ALL]);

    const _cart = await cart
      .findOne({ customer: customer_id, session_id: dto?.cart_session_id })
      .populate(["customer"])
      .lean<Cart>()
      .exec();
    if (!_cart) throw createError("Cart checkout session not found", 404);

    const cus = _cart?.customer as Customer;

    let { amount_off, promo } = await DiscountService.checkPromoForCustomer(cus?._id!, _cart?.total, dto?.coupon!);
    const gift = await giftpurchase.findOne({ code: dto?.coupon, status: 'active' })

    if (!amount_off || amount_off === 0){
      if (gift && gift.amount !== undefined) {
        amount_off += gift.amount || 0;
      } }

    dto.delivery_address = dto?.delivery_address ?? cus?.address;
    dto.phone_number = dto?.phone_number ?? cus?.phone;

    if(dto?.swallow === true && !dto?.extras){
      validateFields(dto, ["extras"]);
    }

    if (!dto?.delivery_address?.address_) throw createError("delivery_address is required", 400);
    if (!dto?.phone_number) throw createError("phone_number is required", 400);

    const result = await OrderService.createOrder(customer_id, {
      ref: dto.cart_session_id,
      delivery_address: dto?.delivery_address ?? cus?.address,
      delivery_fee: _cart?.deliveryFee,
      subtotal: _cart?.subtotal,
      total: _cart?.total,
      phone_number: dto?.phone_number ?? cus?.phone,
      cart_id: _cart?._id!,
      delivery_date: dto?.delivery_date,
      promo: when(!!promo, promo?._id, undefined),
      actual_discounted_amount: amount_off,
      weekend_delivery: dto?.weekend_delivery,
      delivery_period: dto?.delivery_period,
      coupon: dto?.coupon,
      swallow: dto?.swallow,
      extras: dto.extras,
      });

    const { order: _order, items } = result;
    await order
      .findByIdAndUpdate(_order._id!, { items: items?.map((i) => i._id) })
      .lean<Order>()
      .exec();

    const payment_intent = await new BillingService().initializePayment(customer_id, {
      order_id: _order?._id!,
      card_token: dto?.card_token,
    });

    return { order: _order, discount: amount_off, ...payment_intent };
    // return _order;
  }

  private static async createOrder(customer_id: string, dto: CreateOrderDto) {
    const txSession = await order.startSession();
    const items = await cartItem
      .find({ customer: customer_id, cart: dto?.cart_id, session_id: dto?.ref, quantity: { $gt: 0 } })
      .lean<CartItem[]>()
      .exec();

    console.log("Cart Items", items);
    if (items.length < 1) throw createError("Cart items cannot be empty", 400);

    await MealService.validateAvailableMealpackQuantities(items.map((item) => ({ meal_id: item?.item, quantity: item.quantity })));

    let result = {} as { order: Order; items: OrderItem[] };

    try {
      const txs = await txSession.withTransaction(async () => {
        const _order = ((await order.create([{ ...dto, customer: customer_id }], { session: txSession })) as unknown as Order[])[0];
        Object.assign(result, { order: _order });

        const [order_items] = await Promise.all([
          orderItem.insertMany(
            items.map((item) => ({
              customer: customer_id,
              order: _order?._id,
              cart_session_id: _order?.ref,
              item: item?.item as string,
              quantity: item?.quantity,
            })),
            { session: txSession }
          ),
        ]);
        Object.assign(result, { items: order_items });

        console.log("1. Created Order Items", order_items);
      });

      if (txs) await txSession.endSession();
      return result;
    } catch (error) {
      await txSession.endSession();
      throw createError(error.message, 400);
    }
  }

  static async markOrderAsPaid(tx: Transaction) {
    const item = tx?.item as string;
    if (!item) return;
    const _order_items = await orderItem.find({ order: item, customer: tx?.customer }).lean<OrderItem[]>().exec();

    // console.log("Order items", _order_items);
    const _order = await order
      // .findByIdAndUpdate(item, { status: OrderStatus.PAID, items: _order_items.map((i) => i._id) })
      .findByIdAndUpdate(item, { status: OrderStatus.PAID }, { new: true })
      .populate("customer")
      .lean<Order>()
      .exec();

    if (!!_order?.promo && !!_order?.actual_discounted_amount && _order?.actual_discounted_amount > 0)
      await DiscountService.createDiscount(_order?.customer!, _order?.promo!, "order");

    const cusBalance = await earnings.findOne({ customer: _order?.customer});

    if (cusBalance) {
      const remainingBalance = cusBalance.balance - _order.total;

      if (remainingBalance >= 0) {
        cusBalance.balance = remainingBalance; 
      } else {
        cusBalance.balance = 0;
      }
      await cusBalance.save(); 
    }

    const order_item_dto = _order_items.map((item) => ({ meal_id: item?.item!, quantity: item?.quantity }));
    // TODO: remove the session_id on the cart here
    await Promise.all([
      cart
        .updateOne(
          { customer: _order?.customer, session_id: _order?.ref },
          { session_id: undefined, total: 0, subtotal: 0, deliveryFee: 0 }
        )
        .exec(),

      cartItem.deleteMany({ customer: _order?.customer, cart: _order?.cart_id }).exec(),
      MealService.decreaseAvailableMealpackQuantities(order_item_dto),
    ]);
    let cus = await customer.findById(_order?.customer).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);
  
    const payload ={
      name: cus?.first_name!,
      email: cus?.email!,
      order_ref_id: _order?.ref!,
      delivery_date: _order?.delivery_date!,
      delivery_address: `${_order?.delivery_address?.address_}, ${_order?.delivery_address?.city}, ${_order?.delivery_address?.postcode}`!
    }

    // NourishaBus.emit("order:placed", { owner: _order?.customer as Customer, order: _order });
    await sendOrderPlacedEmail(payload.email, payload, false)
  }

  // Typescript will compile this anyways, we don't need to invoke the mountEventListener.
  // When typescript compiles the AccountEventListener, the addEvent decorator will be executed.
  static mountEventListener() {
    new OrderEventListener();
  }
}
