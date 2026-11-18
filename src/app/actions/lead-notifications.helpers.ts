import 'server-only';

import { sendEmail } from '@/app/lib/server/mail/emailService';
import { createEntityNotifier } from '@/app/lib/server/notifications/createEntityNotifier';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email/types';
import { CreateLeadDTO, describeLeadTouch, UserRole } from '@/app/types';

import { ConvertLeadToClientResult } from './lead-conversion.types';

// Telegram messages are sent with parse_mode=HTML; attribution values come from
// the visitor's URL, so they must be escaped before interpolation.
const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function attributionLines(data: CreateLeadDTO): string[] {
  const attribution = data.attribution;
  const last = attribution?.last ?? attribution?.first;
  const lines = [`Канал: ${escapeHtml(describeLeadTouch(last))}`];

  if (last?.utmTerm) lines.push(`Ключове слово: ${escapeHtml(last.utmTerm)}`);
  if (last?.landingPage) {
    lines.push(`Сторінка входу: ${escapeHtml(last.landingPage)}`);
  }

  const first = attribution?.first;
  if (first && attribution?.last && first !== attribution.last) {
    const firstLabel = describeLeadTouch(first);
    if (firstLabel !== describeLeadTouch(attribution.last)) {
      lines.push(`Перший візит: ${escapeHtml(firstLabel)}`);
    }
  }

  return lines;
}

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
      `Форма: ${data.source}`,
      ...attributionLines(data),
      `Імʼя: ${escapeHtml(data.name)}`,
      `Email: ${escapeHtml(data.email)}`,
      `Телефон: ${escapeHtml(data.phone)}`,
    ];

    if (data.message) {
      lines.push(`Повідомлення: ${escapeHtml(data.message)}`);
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
