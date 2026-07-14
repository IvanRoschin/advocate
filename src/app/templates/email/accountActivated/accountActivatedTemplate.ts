import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface Props {
  name: string;
  login: string;
  password: string;
  resetPasswordUrl: string;
}

export function accountActivatedTemplate({
  name,
  login,
  password,
  resetPasswordUrl,
}: Props) {
  return baseEmailLayout({
    title: `Ваш обліковий запис активовано, ${name}`,
    content: `
      <p><strong>Логін:</strong> ${login}</p>
      <p><strong>Пароль:</strong> ${password}</p>
      <p>
        Рекомендуємо змінити пароль:
        <a href="${resetPasswordUrl}" style="color:#3b82f6;">
          змінити пароль
        </a>
      </p>
    `,
    footer: legalFooter(),
  });
}
