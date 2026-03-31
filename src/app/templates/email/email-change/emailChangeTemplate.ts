import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface Props {
  verificationUrl: string;
}

export function emailChangeTemplate({ verificationUrl }: Props) {
  return baseEmailLayout({
    title: 'Підтвердження зміни e-mail',
    content: `
      <p style="font-size:15px; line-height:1.6;">
        Для підтвердження зміни e-mail перейдіть за посиланням:
      </p>
      <p>
        <a href="${verificationUrl}" style="color:#3b82f6; text-decoration:none;">
          Підтвердити зміну e-mail
        </a>
      </p>
    `,
    footer: legalFooter(),
  });
}
