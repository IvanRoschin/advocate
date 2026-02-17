import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface createUserNotification {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export function createUserNotificationTemplate({
  name,
  email,
  role,
  phone,
}: createUserNotification) {
  return baseEmailLayout({
    title: `Новий користувач створений 👤`,
    content: `
      <p style="font-size:15px; line-height:1.6;">
        Користувач <strong>${name}</strong> було створено у системі.
      </p>
      <ul style="font-size:15px; line-height:1.6;">
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Роль:</strong> ${role}</li>
        ${phone ? `<li><strong>Телефон:</strong> ${phone}</li>` : ''}
      </ul>
      <p style="font-size:15px; line-height:1.6;">
        Користувач ще не активований та має підтвердити email для отримання доступу.
      </p>
    `,
    footer: legalFooter(),
  });
}
