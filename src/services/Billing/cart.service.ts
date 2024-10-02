import { IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { AdminSettings, Cart, CartItem, MealPack, Order, adminSettings, cart, cartItem, order } from "../../models";
import { RoleService } from "../../services/role.service";
import { createError, getUpdateOptions, validateFields, paginate } from "../../utils";
import { when } from "../../utils/when";
import omit from "lodash/omit";
import { AvailableResource, PermissionScope } from "../../valueObjects";
import { ClientSession } from "mongoose";
import { nanoid } from "nanoid";
import { add } from "lodash";
import { startOfMonth } from 'date-fns';


interface CartItemDto {
  itemId: string;
  quantity: number;
}

interface CartRo {
  cart: Cart;
  items: PaginatedDocument<CartItem[]>;
}

export class CartService {
  async getCartItemCount(customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    const count = await cartItem
      .countDocuments({ customer: customer_id, quantity: { $gt: 0 } })
      .lean<number>()
      .exec();

    return { item_count: count };
  }

  async getCart(customer_id: string, roles: string[], filters: IPaginationFilter): Promise<CartRo> {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    console.log({ customer_id, roles, filters });

    const [_cart, items] = await Promise.all([
      cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec(),
      paginate<CartItem[]>("cartItem", { customer: customer_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
    ]);

    return { cart: _cart, items };
  }

  async getCart2(customer_id: string | null, roles: string[], filters: IPaginationFilter, device_id?: string): Promise<CartRo> {
    console.log('DEVICE_ID', device_id)
    // await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);

    console.log({ customer_id, roles, filters, device_id });
  
    let _cart;
    let items;
  
    if (customer_id) {
      [_cart, items] = await Promise.all([
        cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec(),
        paginate<CartItem[]>("cartItem", { customer: customer_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
      ]);
    } else if (device_id) {
      [_cart, items] = await Promise.all([
        cart.findOneAndUpdate({ device_id }, { device_id }, getUpdateOptions()).lean<Cart>().exec(),
        paginate<CartItem[]>("cartItem", { device_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
      ]);
    } else {
      throw createError("Customer or device ID must be provided", 400);
    }
  
    return { cart: _cart, items };
  }

  async getCartWeb(
    customer_id: string | null, 
    roles: string[], 
    filters: IPaginationFilter & {session_id?: string}, 
    device_id?: string, 
    // session_id?: string
  ): Promise<CartRo> {
  
    console.log({ customer_id, roles, filters, device_id });
  
    let _cart;
    let items;
  
    if (customer_id) {
      [_cart, items] = await Promise.all([
        cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec(),
        paginate<CartItem[]>("cartItem", { customer: customer_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
      ]);
    } 
    else if (device_id && filters.session_id ) {
      [_cart, items] = await Promise.all([
        cart.findOneAndUpdate({ device_id, session_id: filters.session_id }, { device_id, session_id: filters.session_id }, getUpdateOptions()).lean<Cart>().exec(),
        paginate<CartItem[]>("cartItem", { device_id, session_id: filters.session_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
      ]);
    } 
    // else if (device_id && session_id && customer_id ) {
    //   [_cart, items] = await Promise.all([
    //     cart.findOneAndUpdate({ device_id, session_id, customer: customer_id}, { device_id, session_id }, getUpdateOptions()).lean<Cart>().exec(),
    //     paginate<CartItem[]>("cartItem", { device_id, session_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
    //   ]);

    //   const __cartSes = await cart.findOne({device_id, session_id}).lean()
    //   const __cartSesCus = await cart.findOne({device_id, session_id, customer: customer_id}).lean()

    //   _cart.total = __cartSes?.total + __cartSesCus?.total
    // } 

    else if (device_id && filters.session_id && customer_id) {
      [_cart, items] = await Promise.all([
        cart.findOneAndUpdate({ device_id,session_id: filters.session_id, customer: customer_id }, { device_id, session_id: filters.session_id }, getUpdateOptions()).lean<Cart>().exec(),
        paginate<CartItem[]>("cartItem", { device_id, session_id: filters.session_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
      ]);
    
    }
    
    else if (filters.session_id) {
      [_cart, items] = await Promise.all([
        cart.findOneAndUpdate({ session_id: filters.session_id }, { session_id: filters.session_id }, getUpdateOptions()).lean<Cart>().exec(),
        paginate<CartItem[]>("cartItem", { session_id: filters.session_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
      ]);
    } else {
      throw createError(" device_id, customer_id, or session_id must be provided", 400);
    }
  
    return { cart: _cart, items };
  }
  
  // async addItemToCart(customer_id: string, dto: CartItemDto, roles: string[]): Promise<Cart> {
  //   validateFields(dto, ["itemId", "quantity"]);
  //   await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
  //   const session = await cart.startSession();

  //   let _cart = await cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec();
  //   const cart_session_id = _cart?.session_id ?? nanoid(20);

  //   try {
  //     const txs = await session.withTransaction(async () => {
  //       // const updates = await CartService.calcItemPrice(customer_id, _cart?._id!, cart_session_id, dto, false, session);
  //       const updates = await CartService.calcItemPrice(_cart, dto, cart_session_id, false, session);
  //       _cart = await CartService.updateCartInfo(_cart?._id!, cart_session_id, updates, session);
  //     });

  //     if (txs) await session.endSession();
  //   } catch (error) {
  //     await session.endSession();
  //     throw createError(error.message, 400);
  //   }

  //   return _cart;
  // }

  async addItemToCart(customer_id: string | null, dto: CartItemDto, roles: string[], device_id?: string): Promise<Cart> {

    console.log(roles)
    validateFields(dto, ["itemId", "quantity"]);
    
    const session = await cart.startSession();
    let _cart;
  
    if (customer_id) {
    _cart = await cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec();
    } else {
      _cart = await cart.findOne({ device_id }).lean<Cart>().exec();
  
      if (!_cart) {
        const temp_id = nanoid(20);
        _cart = await cart.create({ temp_id, device_id });
      }
    }
  
    const cart_session_id = _cart?.session_id ?? nanoid(20);
  
    try {
      const txs = await session.withTransaction(async () => {
        const updates = await CartService.calcItemPrice(_cart, dto, cart_session_id, false, session);
        _cart = await CartService.updateCartInfo(_cart?._id!, cart_session_id, updates, session);
      });
  
      if (txs) await session.endSession();
    } catch (error) {
      await session.endSession();
      throw createError(error.message, 400);
    }
  
    return _cart;
  }

  async removeItemFromCart(customer_id: string | null, dto: CartItemDto, roles: string[], device_id?: string): Promise<Cart> {
    validateFields(dto, ["itemId", "quantity"]);
    console.log(roles)
    // await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
    
    const session = await cart.startSession();
    let _cart;
  
    if (customer_id) {
      _cart = await cart.findOne({ customer: customer_id }).lean<Cart>().exec();
    } else if (device_id) {
      _cart = await cart.findOne({ device_id }).lean<Cart>().exec(); // 
    }
  
    if (!_cart && !customer_id && device_id) {
      _cart = await cart.create({
        device_id: device_id,
        temp_id: nanoid(20),
      });
    }
  
    if (!_cart) {
      throw createError("Cart not found", 404);
    }
  
    const cart_session_id = _cart?.session_id ?? nanoid(20);
  
    try {
      const txs = await session.withTransaction(async () => {
        const updates = await CartService.calcItemPrice(_cart, dto, cart_session_id, true, session);
        _cart = await CartService.updateCartInfo(_cart._id, cart_session_id, updates, session);
        
        // Remove cart item if quantity is less than 1
        if (updates?.item?.quantity < 1) {
          await cartItem.deleteOne({ _id: updates?.item._id }, { session });
        }
      });
  
      if (txs) await session.endSession();
    } catch (error) {
      await session.endSession();
      throw createError(error.message, 400);
    }
  
    return _cart;
  }
  

  // async removeItemFromCart(customer_id: string, dto: CartItemDto, roles: string[]): Promise<Cart> {
  //   validateFields(dto, ["itemId", "quantity"]);
  //   await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);
  //   const session = await cart.startSession();

  //   let _cart = await cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec();
  //   const cart_session_id = _cart?.session_id ?? nanoid(20);

  //   try {
  //     const txs = await session.withTransaction(async () => {
  //       // const updates = await CartService.calcItemPrice(customer_id, _cart?._id!, cart_session_id, dto, true, session);
  //       const updates = await CartService.calcItemPrice(_cart, dto, cart_session_id, true, session);
  //       _cart = await CartService.updateCartInfo(_cart?._id!, cart_session_id, updates, session);
  //       if (updates?.item?.quantity < 1) await cartItem.deleteOne({ _id: updates?.item._id }, { session });
  //     });

  //     if (txs) await session.endSession();
  //   } catch (error) {
  //     await session.endSession();
  //     throw createError(error.message, 400);
  //   }

  //   return _cart;
  // }

  async weekendDeliveryUpdate(customer_id: string, roles: string[]): Promise<Order> {
  
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);

    let _order = await order.findOneAndUpdate({ customer: customer_id }, {weekend_delivery: true, delivery_period: 'weekend'}).lean<Order>().exec();
  
    return _order;
  }

  async inweekDeliveryUpdate(customer_id: string, roles: string[]): Promise<Order> {
  
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.UPDATE, PermissionScope.ALL]);

    let _order = await order.findOneAndUpdate({ customer: customer_id }, {weekend_delivery: false, delivery_period: 'in-week'}).lean<Order>().exec();
  
    return _order;
  }


  private static async calcItemPrice(
    // customer_id: string,
    // cart_id: string,
    cart: Cart,
    dto: CartItemDto,
    cart_session_id: string,
    neg = false,
    session?: ClientSession
  ) {
    if (!Number.isInteger(dto?.quantity)) throw createError("😒 quantity must be an integer", 400);

    const { customer: customer_id, _id: cart_id, total, subtotal, deliveryFee } = cart;

    const shouldNegate = (
      (neg: boolean) => (value: number) =>
        when(neg, value * -1, value)
    )(neg);

    let cart_item = await cartItem
      .findOne({ cart: cart_id, item: dto?.itemId, customer: customer_id, session_id: cart_session_id })
      .select(["quantity"])
      .lean<CartItem>()
      .exec();

    if (!!cart_item && dto?.quantity > (cart_item?.quantity ?? 0)) throw createError("Invalid quantity", 400);

    cart_item = await cartItem
      .findOneAndUpdate(
        { cart: cart_id, item: dto.itemId, customer: customer_id, session_id: cart_session_id },
        {
          cart: cart_id,
          item: dto.itemId,
          customer: customer_id,
          session_id: cart_session_id,
          $inc: { quantity: shouldNegate(dto.quantity) },
        },
        { ...getUpdateOptions(), session }
      )
      .select(["item", "quantity"])
      .populate(["item"])
      .lean<CartItem>()
      .exec();

    const item = cart_item?.item as MealPack;
    if (!item) throw createError("Cart item not found", 404);

    return {
      item: cart_item,
      subtotal: Math.max(0, add(subtotal, shouldNegate(item?.price?.amount * dto?.quantity))),
      deliveryFee: Math.max(0, add(deliveryFee, shouldNegate(item?.price?.deliveryFee * dto?.quantity))),
      total: Math.max(0, add(total, shouldNegate(item?.price?.amount * dto?.quantity))),
    };
  }

  private static async updateCartInfo(
    cart_id: string,
    cart_session_id: string,
    info: Awaited<ReturnType<typeof this.calcItemPrice>>,
    session?: ClientSession
  ): Promise<Cart> {
    const settings = await adminSettings
      .findOne({ name: "settings" })
      .select(["delivery_fee", "delivery_fee_calculation_type"])
      .lean<AdminSettings>()
      .exec();

    const delivery_fee_calculation_type = settings?.delivery_fee_calculation_type ?? "fixed";
    const deliveryFee = when(delivery_fee_calculation_type === "fixed", settings?.delivery_fee, info?.deliveryFee);
    const total = Math.max(0, add(info?.subtotal, deliveryFee)) ;

    return await cart
      // .findByIdAndUpdate(cart_id, { session_id: cart_session_id, $inc: { ...omit(info, ["item"]) } }, { new: true, session })
      .findByIdAndUpdate(cart_id, { session_id: cart_session_id, ...omit(info, ["item"]), deliveryFee, total }, { new: true, session })
      .lean<Cart>()
      .exec();
  }

// ...other code

async deleteCarts(roles: string[], filters: IPaginationFilter): Promise<any> {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.DELETE, PermissionScope.ALL]);

    console.log({ roles, filters });

    // Step 1: Fetch cartItems created before this month
    const firstDayOfMonth = startOfMonth(new Date());
    const cartItems = await cartItem.find({
        createdAt: { $lt: firstDayOfMonth },
    }).exec();

    // Step 2: Fetch corresponding carts and update them
    const cartIds = cartItems.map(item => item.cart);
    const carts = await cart.updateMany(
        { _id: { $in: cartIds } },
        { $set: { subtotal: 0, total: 10 } }
    ).exec();

    console.log('@@@@@@@@@@@@@@@', carts)

    // Step 3: Delete the cartItems
   const items  = await cartItem.deleteMany({
        _id: { $in: cartItems.map(item => item._id) }
    }).exec();

    // Fetch the updated cart and items to return
    // const [_cart, items] = await Promise.all([
    //     cart.findOneAndUpdate({ customer: customer_id }, { customer: customer_id }, getUpdateOptions()).lean<Cart>().exec(),
    //     paginate<CartItem[]>("cartItem", { customer: customer_id, quantity: { $gt: 0 } }, filters, { populate: ["item"] }),
    // ]);    

    return { cart: carts, items };
}

}
