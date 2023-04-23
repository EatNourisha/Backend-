import { IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { Notification, NotificationStatus, notification } from "../../models";
import { RoleService } from "../role.service";
import { createError, paginate } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";

export class NotificationService {
  async getCurrentUserNotifications(
    customer_id: string,
    roles: string[],
    filters: IPaginationFilter & { status?: NotificationStatus }
  ): Promise<PaginatedDocument<Notification[]>> {
    await RoleService.hasPermission(roles, AvailableResource.NOTIFICATION, [PermissionScope.READ, PermissionScope.ALL]);
    let queries: any = { customer: customer_id };
    if (!!filters?.status) Object.assign(queries, { status: filters.status });
    return await paginate("notification", queries, filters);
  }

  async markAsRead(id: string, customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.NOTIFICATION, [PermissionScope.MARK, PermissionScope.ALL]);
    const note = await notification.findOneAndUpdate({ _id: id, customer: customer_id }, { status: "read" }).lean<Notification>().exec();
    if (!note) throw createError("Notification does not exist", 404);
    return note;
  }
}
