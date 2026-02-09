import { EmailTemplateType } from '@/app/templates/email/types';

export interface EmailMeta {
  subject: string;
  from?: {
    name: string;
    email: string;
  };
}

export const emailMetaMap: Record<EmailTemplateType, EmailMeta> = {
  [EmailTemplateType.LEAD_CLIENT]: {
    subject: 'Дякуємо за звернення',
  },
  [EmailTemplateType.LEAD_ADMIN]: {
    subject: 'Новий лід',
  },
  [EmailTemplateType.SUBSCRIBER_CLIENT]: {
    subject: 'Дякуємо за підписку',
  },
  [EmailTemplateType.SUBSCRIBER_ADMIN]: {
    subject: 'Новий підписник',
  },

  [EmailTemplateType.VERIFICATION]: {
    subject: 'Підтвердження реєстрації',
  },

  [EmailTemplateType.EMAIL_CHANGE]: {
    subject: 'Підтвердження зміни e-mail',
  },

  [EmailTemplateType.USER_CREDENTIALS]: {
    subject: 'Ваші дані для входу',
  },

  [EmailTemplateType.ACCOUNT_ACTIVATED]: {
    subject: 'Активація аккаунта',
  },
};
