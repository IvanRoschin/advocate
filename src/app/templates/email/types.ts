export enum EmailTemplateType {
  LEAD_CLIENT = 'LEAD_CLIENT',
  LEAD_ADMIN = 'LEAD_ADMIN',
  SUBSCRIBER_CLIENT = ' SUBSCRIBER_CLIENT',
  SUBSCRIBER_ADMIN = 'SUBSCRIBER_ADMIN',
  VERIFICATION = 'VERIFICATION',
  EMAIL_CHANGE = 'EMAIL_CHANGE',
  USER_CREDENTIALS = 'USER_CREDENTIALS',
  ACCOUNT_ACTIVATED = 'ACCOUNT_ACTIVATED',
}

export type EmailTemplatePropsMap = {
  [EmailTemplateType.LEAD_CLIENT]: {
    name?: string;
  };

  [EmailTemplateType.LEAD_ADMIN]: {
    name: string;
    email: string;
    phone: string;
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

  [EmailTemplateType.EMAIL_CHANGE]: {
    name: string;
    email: string;
    verificationUrl: string;
  };

  [EmailTemplateType.USER_CREDENTIALS]: {
    name: string;
    login: string;
    password: string;
    resetPasswordUrl: string;
  };

  [EmailTemplateType.ACCOUNT_ACTIVATED]: {
    name: string;
    login: string;
    password: string;
  };
};
