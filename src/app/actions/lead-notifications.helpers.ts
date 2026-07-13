import 'server-only';

import { sendEmail } from '@/app/lib/server/mail/emailService';
import { createEntityNotifier } from '@/app/lib/server/notifications/createEntityNotifier';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email/types';
import { CreateLeadDTO, UserRole } from '@/app/types';

import { ConvertLeadToClientResult } from './lead-conversion.types';

export const notifyLeadCreated = createEntityNotifier<CreateLeadDTO>({
  clientEmail: data => ({
    to: data.email,
    type: EmailTemplateType.LEAD_CLIENT,
    props: { name: data.name },
  }),

  adminEmail: data => ({
    type: EmailTemplateType.LEAD_ADMIN,
    props: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
    },
  }),

  telegramMessage: data => {
    const lines = [
      '🚨 <b>Нова заявка</b>',
      `Джерело: ${data.source}`,
      `Імʼя: ${data.name}`,
      `Email: ${data.email}`,
      `Телефон: ${data.phone}`,
    ];

    if (data.message) {
      lines.push(`Повідомлення: ${data.message}`);
    }

    return lines.join('\n');
  },
});

/* ================= Conversion notifications ================= */

export async function notifyClientAccountProvisioned(
  baseUrl: string,
  verifyEmailPath: string,
  conversionResult: ConvertLeadToClientResult
): Promise<void> {
  const { clientAccountUser } = conversionResult;

  if (
    !clientAccountUser.verificationToken ||
    !clientAccountUser.temporaryPassword
  ) {
    return;
  }

  const verificationUrl =
    `${baseUrl}${verifyEmailPath}` +
    `?token=${clientAccountUser.verificationToken}` +
    `&email=${encodeURIComponent(clientAccountUser.email)}`;

  await sendEmail({
    to: clientAccountUser.email,
    type: EmailTemplateType.ACTIVATE_USER_ACCOUNT,
    props: {
      name: clientAccountUser.name,
      verificationUrl,
      temporaryPassword: clientAccountUser.temporaryPassword,
      email: clientAccountUser.email,
    },
  }).catch(err => console.error('[NOTIFY_ACTIVATE_ACCOUNT_ERROR]', err));

  await sendEmail({
    to: person.email,
    type: EmailTemplateType.USER_CREATED,
    props: {
      name: clientAccountUser.name,
      email: clientAccountUser.email,
      role: UserRole.CLIENT,
      phone: clientAccountUser.phone,
    },
  }).catch(err => console.error('[NOTIFY_USER_CREATED_ERROR]', err));
}
