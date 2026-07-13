import { sendEmail } from '@/app/lib/server/mail/emailService';
import { sendTelegramMessage } from '@/app/lib/server/sendTelegram';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email/types';
import 'server-only';

type EmailSpec = {
  type: EmailTemplateType;
  props: Record<string, unknown>;
};

type NotifierConfig<T> = {
  /** Лист клієнту. Поверніть null, якщо для цих даних лист не потрібен. */
  clientEmail?: (data: T) => ({ to: string } & EmailSpec) | null;
  /** Лист адміну — адресат завжди person.email, тут лишень зміст. */
  adminEmail?: (data: T) => EmailSpec;
  /** Текст повідомлення в Telegram. */
  telegramMessage?: (data: T) => string;
};

export function createEntityNotifier<T>(config: NotifierConfig<T>) {
  return async function notify(data: T): Promise<void> {
    if (config.clientEmail) {
      const email = config.clientEmail(data);
      if (email) {
        await sendEmail(email).catch(err =>
          console.error('[NOTIFY_CLIENT_EMAIL_ERROR]', err)
        );
      }
    }

    if (config.adminEmail) {
      if (!person.email) {
        console.error('[NOTIFY_ADMIN_EMAIL_ERROR] person.email не заданий');
      } else {
        const email = config.adminEmail(data);
        await sendEmail({ to: person.email, ...email }).catch(err =>
          console.error('[NOTIFY_ADMIN_EMAIL_ERROR]', err)
        );
      }
    }

    if (config.telegramMessage) {
      await sendTelegramMessage(config.telegramMessage(data)).catch(err =>
        console.error('[NOTIFY_TELEGRAM_ERROR]', err)
      );
    }
  };
}
