import 'server-only';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { sendTelegramMessage } from '@/app/lib/server/sendTelegram';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email/types';
import { UserRole } from '@/app/types';
import type { CreateLeadDTO } from '@/app/types';
import type { ConvertLeadToClientResult } from './lead-conversion.types';

/* ================= New lead notifications ================= */

export async function notifyClient(data: CreateLeadDTO): Promise<void> {
  await sendEmail({
    to: data.email,
    type: EmailTemplateType.LEAD_CLIENT,
    props: {
      name: data.name,
    },
  });
}

export async function notifyAdmin(data: CreateLeadDTO): Promise<void> {
  await sendEmail({
    to: person.email,
    type: EmailTemplateType.LEAD_ADMIN,
    props: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
    },
  });
}

export async function notifyTelegram(data: CreateLeadDTO): Promise<void> {
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

  await sendTelegramMessage(lines.join('\n'));
}

export async function notifyLeadCreated(data: CreateLeadDTO): Promise<void> {
  await notifyClient(data).catch(console.error);
  await notifyAdmin(data).catch(console.error);
  await notifyTelegram(data).catch(console.error);
}

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
  }).catch(console.error);

  await sendEmail({
    to: person.email,
    type: EmailTemplateType.USER_CREATED,
    props: {
      name: clientAccountUser.name,
      email: clientAccountUser.email,
      role: UserRole.CLIENT,
      phone: clientAccountUser.phone,
    },
  }).catch(console.error);
}
