export enum AvailableRole {
  SUPERADMIN = "superadmin", // Has access to all the features on the admin
  CUSTOMER = "customer",
}

export enum PermissionScope {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  ASSIGN = "assign",
  DELETE = "delete",
  DISABLE = "disable",
  ENABLE = "enable",
  VERIFY = "verify",
  REQUEST = "request",
  APPROVE = "approve",
  REJECT = "reject",
  MARK = "mark", // mark notification read | unread
  ALL = "*",
}

/// Don't use camelCase or PascalCase for Resource naming
/// Use underscore separated names instead to make the role system work properly.
export enum AvailableResource {
  ROLE = "role",
  MEAL = "meal",
  CUSTOMER = "customer",
  NOTIFICATION = "notification",
}
