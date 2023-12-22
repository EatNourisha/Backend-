import { createError, getUpdateOptions, paginate } from "../../utils";
import { Customer, Transaction, customer, transaction } from "../../models";
import { IPaginationFilter, updateTransactionDto } from "../../interfaces";
import { RoleService } from "../role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";

export class TransactionService {
  static async updateTransaction(stripe_customer_id: string, dto: updateTransactionDto, dryRun = true) {
    const cus = await customer.findOne({ stripe_id: stripe_customer_id }).lean<Customer>().exec();
    if (!cus && dryRun) return;
    else if (!cus && !dryRun) throw createError("Customer does not exist", 404);

    const tx = await transaction.findOneAndUpdate(
      { customer: cus?._id, payment_intent: dto?.payment_intent },
      { ...dto, customer: cus?._id },
      getUpdateOptions()
    );
    return tx;
  }

  async getTransactionById(id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
    const tx = await transaction
      .findById(id)
      .populate([{ path: "item" }, { path: "plan" }])
      .lean<Transaction>()
      .exec();
    if (!tx) throw createError("Transaction does not exist", 404);
    return tx;
  }

  async getTransactions(customer_id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.hasPermission(roles, AvailableResource.CUSTOMER, [PermissionScope.READ, PermissionScope.ALL]);
    return await paginate("transaction", { customer: customer_id }, filters);
  }

  // admin
  async getCusomterTransactions(customer_id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.TRANSACTION, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);
    return await paginate("transaction", { customer: customer_id }, filters);
  }
}
