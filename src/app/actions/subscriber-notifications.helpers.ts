import { createEntityNotifier } from '@/app/lib/server/notifications/createEntityNotifier';
import { EmailTemplateType } from '@/app/templates/email/types';

export const notifySubscriberCreated = createEntityNotifier<{ email: string }>({
  clientEmail: data => ({
    to: data.email,
    type: EmailTemplateType.SUBSCRIBER_CLIENT,
    props: { email: data.email },
  }),

  adminEmail: data => ({
    type: EmailTemplateType.SUBSCRIBER_ADMIN,
    props: { email: data.email },
  }),

  telegramMessage: data => `🚨 Новий підписник: ${data.email}`,
});
