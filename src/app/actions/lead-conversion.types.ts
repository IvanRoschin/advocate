import 'server-only';

type ClientAccessRole = 'owner' | 'manager' | 'viewer';

export type ExistingUserResolution =
  | { kind: 'create_new_user' }
  | {
      kind: 'link_existing_user';
      user: {
        _id: import('mongoose').Types.ObjectId;
        name: string;
        email: string;
        phone?: string;
        role?: string;
        isActive?: boolean;
      };
    };

export type ClientAccountUserProvisionResult = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  wasCreated: boolean;
  wasLinked: boolean;
  temporaryPassword?: string;
};

export type ConvertLeadToClientResult = {
  lead: {
    id: string;
    converted: true;
  };
  client: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  clientAccountUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    wasCreated: boolean;
    wasLinked: boolean;
    temporaryPassword?: string;
    verificationToken?: string;
  };
  clientAccess: {
    userId: string;
    clientId: string;
    accessRole: ClientAccessRole;
    isActive: true;
  };
  case: unknown;
};
