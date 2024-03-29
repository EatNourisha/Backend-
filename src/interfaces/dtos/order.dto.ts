import { Address } from "../../models/customer";
import { Order } from "../../models";

export interface CreateOrderDto extends Omit<Order, "_id" | "createdAt" | "updatedAt" | "customer" | "status"> {}

export interface PlaceOrderDto {
  delivery_address?: Address;
  phone_number?: string;
  card_token?: string;
  cart_session_id: string;
  coupon_code?: string;
  delivery_date: Date;
}
