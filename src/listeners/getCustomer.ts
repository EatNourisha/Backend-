import { Customer, customer } from "../models";

export function getCustomerId(data: Customer | string): string {
  if (typeof data === "object" && !!data?._id) (data as Customer)?._id!;
  return data as string;
}

export async function getCustomerInfo(data: Customer | string): Promise<Customer | null> {
  if (typeof data === "object") (data as Customer)!;
  const cus = await customer
    .findById(data as string)
    .select(["first_name", "last_name"])
    .lean<Customer>()
    .exec();
  if (!cus) return null;
  return cus;
}
