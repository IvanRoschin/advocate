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

  // Пользователь после регистрации
  [EmailTemplateType.VERIFICATION]: {
    subject: 'Підтвердження реєстрації',
  },

  // Пользователь при смене email
  [EmailTemplateType.EMAIL_CHANGE]: {
    subject: 'Підтвердження зміни e-mail',
  },

  // Админ: создан новый пользователь (без кредов)
  [EmailTemplateType.USER_CREATED]: {
    subject: 'Новий користувач створений',
  },

  // Пользователь после активации (включает login/password + reset link)
  [EmailTemplateType.ACCOUNT_ACTIVATED]: {
    subject: 'Ваш обліковий запис активовано',
  },

  [EmailTemplateType.ACTIVATE_USER_ACCOUNT]: {
    subject: 'Активуйте доступ до особистого кабінету',
  },

  [EmailTemplateType.RESET_PASSWORD]: {
    subject: 'Відновлення паролю',
  },
};
