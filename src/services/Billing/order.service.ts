import { RoleService } from "../role.service";
import { CreateOrderDto, IPaginationFilter, PaginatedDocument, PlaceOrderDto } from "../../interfaces";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { Cart, CartItem, Customer, Order, OrderItem, cart, cartItem, order, orderItem } from "../../models";
import { createError, paginate, validateFields } from "../../utils";
import { BillingService } from "./billing.service";

export class OrderService {
  async getOrders(customer_id: string, roles: string[], filters: IPaginationFilter): Promise<PaginatedDocument<Order[]>> {
    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ, PermissionScope.ALL]);
    return await paginate("order", { customer: customer_id }, filters);
  }

  async getOrderById(order_id: string, customer_id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.hasPermission(roles, AvailableResource.ORDER, [PermissionScope.READ, PermissionScope.ALL]);

    const [_order, items] = await Promise.all([
      order.findById(order_id).lean<Order>().exec(),
      paginate<OrderItem[]>("orderItem", { customer: customer_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
    ]);

    return { order: _order, items };
  }

  async placeOrder(customer_id: string, dto: PlaceOrderDto, roles: string[]) {
    validateFields(dto, ["cart_session_id"]);
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
          // TODO: remove the session_id on the cart here
          cart.updateOne({ customer: customer_id, session_id: _order?.ref }, { session_id: undefined }, { session: txSession }).exec(),
        ]);

        // TODO: remove the cart items with the session_id
        await cartItem.deleteMany({ customer: customer_id, session_id: _order?.ref }, { session: txSession }).exec();
      });

      if (txs) await txSession.endSession();
      return result.order;
    } catch (error) {
      await txSession.endSession();
      throw createError(error.message, 400);
    }
  }
}
