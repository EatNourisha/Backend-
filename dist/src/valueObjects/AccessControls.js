"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = require("../valueObjects/Role");
const defaultAccessControls = {
    customer: {
        permissions: [
            {
                name: Role_1.AvailableResource.CUSTOMER,
                scopes: [Role_1.PermissionScope.READ, Role_1.PermissionScope.UPDATE, Role_1.PermissionScope.VERIFY],
            },
            {
                name: Role_1.AvailableResource.NOTIFICATION,
                scopes: [Role_1.PermissionScope.READ, Role_1.PermissionScope.MARK],
            },
            {
                name: Role_1.AvailableResource.MEAL,
                scopes: [Role_1.PermissionScope.READ],
            },
        ],
    },
    superadmin: {
        permissions: [
            {
                name: Role_1.AvailableResource.CUSTOMER,
                scopes: [Role_1.PermissionScope.ALL],
            },
            {
                name: Role_1.AvailableResource.NOTIFICATION,
                scopes: [Role_1.PermissionScope.ALL],
            },
            {
                name: Role_1.AvailableResource.MEAL,
                scopes: [Role_1.PermissionScope.ALL],
            },
        ],
    },
};
exports.default = defaultAccessControls;
//# sourceMappingURL=AccessControls.js.map