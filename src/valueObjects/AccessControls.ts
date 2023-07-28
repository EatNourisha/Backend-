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
      {
        name: AvailableResource.PLAN,
        scopes: [PermissionScope.READ],
      },
      {
        name: AvailableResource.ALLERGY,
        scopes: [PermissionScope.READ],
      },
      {
        name: AvailableResource.SUBSCRIPTION,
        scopes: [PermissionScope.CANCEL, PermissionScope.READ],
      },
      {
        name: AvailableResource.REFERRAL,
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
        name: AvailableResource.BROADCAST,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.MEAL,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.PLAN,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.SUBSCRIPTION,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.ALLERGY,
        scopes: [PermissionScope.ALL],
      },
      {
        name: AvailableResource.REFERRAL,
        scopes: [PermissionScope.ALL],
      },
    ],
  },
};

export default defaultAccessControls;
