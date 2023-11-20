import { RoleService } from "../role.service";
import { CreateOrderDto, IPaginationFilter, PaginatedDocument, PlaceOrderDto } from "../../interfaces";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { Cart, CartItem, Customer, Order, OrderItem, Transaction, cart, cartItem, order, orderItem } from "../../models";
import { createError, paginate, validateFields } from "../../utils";
import { BillingService } from "./billing.service";
import { OrderStatus } from "../../models/order";

export class OrderService {
  async getOrders(customer_id: string, roles: string[], filters: IPaginationFilter): Promise<PaginatedDocument<Order[]>> {
    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ, PermissionScope.ALL]);
    return await paginate("order", { customer: customer_id }, filters);
  }

  async getOrderById(order_id: string, customer_id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ, PermissionScope.ALL]);

    const [_order, items] = await Promise.all([
      order.findById(order_id).lean<Order>().exec(),
      paginate<OrderItem[]>("orderItem", { order: order_id, customer: customer_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
    ]);

    return { order: _order, items };
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
    const _order = await order.findOneAndUpdate({ order_id }, { status: dto.status }, { new: true }).lean<Order>().exec();
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

    dto.delivery_address = dto?.delivery_address ?? cus?.address;
    dto.phone_number = dto?.phone_number ?? cus?.phone;
    console.log("Customer", cus?.address, dto?.delivery_address);

    if (!dto?.delivery_address?.address_) throw createError("delivery_address is required", 400);
    if (!dto?.phone_number) throw createError("phone_number is required", 400);

    const _order = await OrderService.createOrder(customer_id, {
      ref: dto.cart_session_id,
      delivery_address: dto?.delivery_address ?? cus?.address,
      delivery_fee: _cart?.deliveryFee,
      subtotal: _cart?.subtotal,
      total: _cart?.total,
      phone_number: dto?.phone_number ?? cus?.phone,
      cart_id: _cart?._id!,
      delivery_date: dto?.delivery_date,
    });

    console.log("Created Order", _order);

    const payment_intent = await new BillingService().initializePayment(customer_id, {
      order_id: _order?._id!,
      card_token: dto?.card_token,
    });

    return { order: _order, ...payment_intent };
    // return _order;
  }

  private static async createOrder(customer_id: string, dto: CreateOrderDto) {
    const txSession = await order.startSession();
    const items = await cartItem
      .find({ customer: customer_id, cart: dto?.cart_id, session_id: dto?.ref, quantity: { $gt: 0 } })
      .lean<CartItem[]>()
      .exec();
    if (items.length < 1) throw createError("Cart items cannot be empty", 400);

    let result = {} as { order: Order };

    try {
      const txs = await txSession.withTransaction(async () => {
        const _order = ((await order.create([{ ...dto, customer: customer_id }], { session: txSession })) as unknown as Order[])[0];
        Object.assign(result, { order: _order });

        await Promise.all([
          orderItem.insertMany(
            items.map((item) => ({
              customer: customer_id,
              order: _order?._id,
              cart_session_id: _order?.ref,
              item: item?._id,
              quantity: item?.quantity,
            })),
            { session: txSession }
          ),
        ]);
      });

      if (txs) await txSession.endSession();
      return result.order;
    } catch (error) {
      await txSession.endSession();
      throw createError(error.message, 400);
    }
  }

  static async markOrderAsPaid(tx: Transaction) {
    const item = tx?.item as string;
    if (!item) return;
    const _order = await order.findByIdAndUpdate(item, { status: OrderStatus.PAID }).lean<Order>().exec();
    // TODO: remove the session_id on the cart here
    await Promise.all([
      cart
        .updateOne(
          { customer: _order?.customer, session_id: _order?.ref },
          { session_id: undefined, total: 0, subtotal: 0, deliveryFee: 0 }
        )
        .exec(),
      // TODO: remove the cart items with the session_id
      cartItem.deleteMany({ customer: _order?._id, session_id: _order?.ref }).exec(),
    ]);
  }
}
