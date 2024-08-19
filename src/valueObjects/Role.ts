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
  CANCEL = "cancel",
  REQUEST = "request",
  APPROVE = "approve",
  REJECT = "reject",
  MARK = "mark", // mark notification read | unread
  ALL = "*",
  BROADCAST = "broadcast",
}

/// Don't use camelCase or PascalCase for Resource naming
/// Use underscore separated names instead to make the role system work properly.
export enum AvailableResource {
  ROLE = "role",
  MEAL = "meal",
  MEALEXTRAS = "mealextras",
  CATEGORY = "category",
  PLAN = "plan",
  ALLERGY = "allergy",
  CUSTOMER = "customer",
  NOTIFICATION = "notification",
  SUBSCRIPTION = "subscription",
  BROADCAST = "broadcast",
  REFERRAL = "referral",
  REVIEW = "referral",
  ORDER = "order",
  TRANSACTION = "transaction",
  ADMIN_SETTINGS = "settings",
  MEAL_ANALYSIS = "meal_analysis",
  DISCOUNT = "discount",
  GIFTCARD = "giftcard",
  CUSTOMGIFT = "customgift",
  GIFTIMAGES = "giftimages",
  CSTEAM = "csteam",
  CSREPORT = "csreport",
  CSFOLLOWUP = "csfollowup",
}
