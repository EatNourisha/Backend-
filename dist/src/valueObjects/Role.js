"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableResource = exports.PermissionScope = exports.AvailableRole = void 0;
var AvailableRole;
(function (AvailableRole) {
    AvailableRole["SUPERADMIN"] = "superadmin";
    AvailableRole["CUSTOMER"] = "customer";
})(AvailableRole = exports.AvailableRole || (exports.AvailableRole = {}));
var PermissionScope;
(function (PermissionScope) {
    PermissionScope["READ"] = "read";
    PermissionScope["CREATE"] = "create";
    PermissionScope["UPDATE"] = "update";
    PermissionScope["ASSIGN"] = "assign";
    PermissionScope["DELETE"] = "delete";
    PermissionScope["DISABLE"] = "disable";
    PermissionScope["ENABLE"] = "enable";
    PermissionScope["VERIFY"] = "verify";
    PermissionScope["REQUEST"] = "request";
    PermissionScope["APPROVE"] = "approve";
    PermissionScope["REJECT"] = "reject";
    PermissionScope["MARK"] = "mark";
    PermissionScope["ALL"] = "*";
})(PermissionScope = exports.PermissionScope || (exports.PermissionScope = {}));
var AvailableResource;
(function (AvailableResource) {
    AvailableResource["ROLE"] = "role";
    AvailableResource["MEAL"] = "meal";
    AvailableResource["CUSTOMER"] = "customer";
    AvailableResource["NOTIFICATION"] = "notification";
})(AvailableResource = exports.AvailableResource || (exports.AvailableResource = {}));
//# sourceMappingURL=Role.js.map