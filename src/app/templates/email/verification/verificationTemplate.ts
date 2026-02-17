import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

interface Props {
  name: string;
  verificationUrl: string;
}

export function verificationTemplate({ name, verificationUrl }: Props) {
  return baseEmailLayout({
    title: `Привіт, ${name}! 👋`,
    content: `
      <p style="font-size:15px; line-height:1.6;">
        Для активації облікового запису перейдіть за посиланням:
      </p>
      <p>
        <a href="${verificationUrl}" style="color:#3b82f6; text-decoration:none;">
          Підтвердити реєстрацію
        </a>
      </p>
    `,
    footer: legalFooter(),
  });
}
