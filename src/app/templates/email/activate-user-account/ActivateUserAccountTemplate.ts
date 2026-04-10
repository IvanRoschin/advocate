import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface ActivateCabinetAccessTemplateProps {
  name: string;
  verificationUrl: string;
  temporaryPassword: string;
  email: string;
}

export function activateUserAccountAccessTemplate({
  name,
  verificationUrl,
  temporaryPassword,
  email,
}: ActivateCabinetAccessTemplateProps) {
  return baseEmailLayout({
    title: 'Доступ до особистого кабінету 🔐',
    content: `
      <p style="font-size:15px; line-height:1.6;">
        Вітаємо, <strong>${name}</strong>!
      </p>

      <p style="font-size:15px; line-height:1.6;">
        Для вас створено обліковий запис для доступу до особистого кабінету клієнта.
      </p>

      <p style="font-size:15px; line-height:1.6;">
        <strong>Логін:</strong> ${email}<br />
        <strong>Тимчасовий пароль:</strong> ${temporaryPassword}
      </p>

      <p style="font-size:15px; line-height:1.6;">
        Щоб активувати обліковий запис, будь ласка, підтвердіть email за посиланням нижче:
      </p>

      <p style="margin:24px 0;">
        <a
          href="${verificationUrl}"
          style="display:inline-block; padding:12px 20px; background:#111; color:#fff; text-decoration:none; border-radius:8px; font-weight:600;"
        >
          Активувати обліковий запис
        </a>
      </p>

      <p style="font-size:14px; line-height:1.6; color:#666;">
        Після входу рекомендуємо одразу змінити тимчасовий пароль.
      </p>
    `,
    footer: legalFooter(),
  });
}
