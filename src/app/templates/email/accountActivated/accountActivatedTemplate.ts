import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface Props {
  name: string;
  login: string;
  password: string;
}

export function accountActivatedTemplate({ name, login, password }: Props) {
  return baseEmailLayout({
    title: `Ваш обліковий запис активовано, ${name}`,
    content: `
      <p><strong>Логін:</strong> ${login}</p>
      <p>Тимчасовий пароль: <strong>${password}</strong></p>
      <p>Рекомендуємо змінити пароль після входу.</p>
    `,
    footer: legalFooter(),
  });
}
