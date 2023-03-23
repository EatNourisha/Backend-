import { AvailableResource, AvailableRole, PermissionScope } from "../valueObjects/Role";

export type AccessControlType = {
  [key in AvailableRole]: {
    permissions: {
      name: AvailableResource;
      scopes: PermissionScope[];
    }[];
  };
};

const defaultAccessControls: AccessControlType = {
  customer: {
    permissions: [
      {
        name: AvailableResource.CUSTOMER,
        scopes: [PermissionScope.READ, PermissionScope.UPDATE, PermissionScope.VERIFY],
      },
      {
        name: AvailableResource.NOTIFICATION,
        scopes: [PermissionScope.READ, PermissionScope.MARK],
      },
      {
        name: AvailableResource.MEAL,
        scopes: [PermissionScope.READ],
      },
    ],
  },
  superadmin: {
    permissions: [
      {
        name: AvailableResource.CUSTOMER,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.NOTIFICATION,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.MEAL,
        scopes: [PermissionScope.ALL],
      },
    ],
  },
};

export default defaultAccessControls;