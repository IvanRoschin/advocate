import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

export interface SubscriberAdminTemplateProps {
  email: string;
}

export function subscriberAdminTemplate({
  email,
}: SubscriberAdminTemplateProps) {
  return baseEmailLayout({
    title: `🚨 Новый подписчик на рассылку`,
    content: subscriberAdminContent({ email }),
    footer: legalFooter(),
  });
}

export function subscriberAdminContent({
  email,
}: SubscriberAdminTemplateProps) {
  return `
    <p style="font-size: 15px; line-height: 1.6;">
      Новый подписчик: <strong>${email}</strong>
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      Проверьте его данные и добавьте в базу подписчиков, если нужно.
    </p>
  `;
}
