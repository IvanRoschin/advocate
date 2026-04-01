import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface ResetPasswordTemplateProps {
  name?: string;
  resetLink: string;
  expiresInMinutes?: number;
}

export function resetPasswordTemplate({
  name,
  resetLink,
  expiresInMinutes = 60,
}: ResetPasswordTemplateProps) {
  return baseEmailLayout({
    title: `Відновлення паролю 🔐`,
    content: `
      <p style="font-size:15px; line-height:1.6;">
        ${name ? `Вітаємо, <strong>${name}</strong>!` : 'Вітаємо!'}
      </p>

      <p style="font-size:15px; line-height:1.6;">
        Ви надіслали запит на відновлення паролю.
      </p>

      <p style="font-size:15px; line-height:1.6;">
        Щоб встановити новий пароль, перейдіть за посиланням:
      </p>

      <div style="margin:20px 0; text-align:center;">
        <a 
          href="${resetLink}" 
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-size:15px;
            font-weight:600;
          "
        >
          Відновити пароль
        </a>
      </div>

      <p style="font-size:14px; line-height:1.6; color:#555;">
        Або відкрийте це посилання вручну:
      </p>

      <p style="font-size:13px; word-break:break-all; color:#2563eb;">
        ${resetLink}
      </p>

      <p style="font-size:14px; line-height:1.6; color:#555;">
        Посилання дійсне протягом <strong>${expiresInMinutes} хвилин</strong>.
      </p>

      <p style="font-size:14px; line-height:1.6; color:#555;">
        Якщо ви не надсилали цей запит — просто проігноруйте цей лист.
      </p>
    `,
    footer: legalFooter(),
  });
}
