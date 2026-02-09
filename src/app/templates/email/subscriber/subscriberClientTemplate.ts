import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

export interface SubscriberClientTemplateProps {
  email: string;
}

export function subscriberClientTemplate({
  email,
}: SubscriberClientTemplateProps) {
  return baseEmailLayout({
    title: `Подписка подтверждена ✅`,
    content: subscriberClientContent({ email }),
    footer: legalFooter(),
  });
}

export function subscriberClientContent({
  email,
}: SubscriberClientTemplateProps) {
  return `
    <p style="font-size: 15px; line-height: 1.6;">
      Привет! Вы успешно подписались на нашу рассылку.
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      Ваш email: <strong>${email}</strong>
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      Вы будете получать новости и обновления от нас. Спасибо, что остаетесь с нами! 🚀
    </p>
  `;
}
