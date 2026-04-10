export enum EmailTemplateType {
  LEAD_CLIENT = 'LEAD_CLIENT',
  LEAD_ADMIN = 'LEAD_ADMIN',
  SUBSCRIBER_CLIENT = ' SUBSCRIBER_CLIENT',
  SUBSCRIBER_ADMIN = 'SUBSCRIBER_ADMIN',
  VERIFICATION = 'VERIFICATION',
  USER_CREATED = 'USER_CREATED',
  EMAIL_CHANGE = 'EMAIL_CHANGE',
  ACCOUNT_ACTIVATED = 'ACCOUNT_ACTIVATED',
  ACTIVATE_USER_ACCOUNT = 'ACTIVATE_USER_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export type EmailTemplatePropsMap = {
  [EmailTemplateType.LEAD_CLIENT]: {
    name?: string;
  };

  [EmailTemplateType.LEAD_ADMIN]: {
    name: string;
    email: string;
    phone: string;
    message: string;
    source: string;
  };

  [EmailTemplateType.SUBSCRIBER_CLIENT]: {
    email: string;
  };

  [EmailTemplateType.SUBSCRIBER_ADMIN]: {
    email: string;
  };

  [EmailTemplateType.VERIFICATION]: {
    name: string;
    verificationUrl: string;
  };

  [EmailTemplateType.USER_CREATED]: {
    name: string;
    email: string;
    role: string;
    phone: string;
  };

  [EmailTemplateType.EMAIL_CHANGE]: {
    name: string;
    email: string;
    verificationUrl: string;
  };

  [EmailTemplateType.ACCOUNT_ACTIVATED]: {
    name: string;
    login: string;
    password: string;
    resetPasswordUrl: string;
  };

  [EmailTemplateType.ACTIVATE_USER_ACCOUNT]: {
    name: string;
    verificationUrl: string;
    temporaryPassword: string;
    email: string;
  };

  [EmailTemplateType.RESET_PASSWORD]: {
    name: string;
    resetLink: string;
  };
};
