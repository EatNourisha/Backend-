import { Customer } from "../models";

export function getCustomerId(data: Customer | string): string  {
    if(typeof data === 'object') (data as Customer)?._id!;
    return data as string;
}