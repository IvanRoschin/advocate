import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

export interface SubscriberClientTemplateProps {
  email: string;
}

export function subscriberClientTemplate({
  email,
}: SubscriberClientTemplateProps) {
  return baseEmailLayout({
    title: `Підписку підтверджено ✅`,
    content: subscriberClientContent({ email }),
    footer: legalFooter(),
  });
}

function subscriberClientContent({
  email,
}: SubscriberClientTemplateProps) {
  return `
    <p style="font-size: 15px; line-height: 1.6;">
      Вітаємо! Ви успішно підписалися на нашу розсилку.
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      Ваш email: <strong>${email}</strong>
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      Ви будете отримувати новини та оновлення від нас. Дякуємо, що залишаєтесь із нами! 🚀
    </p>
  `;
}
