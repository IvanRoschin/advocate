import { NextResponse } from 'next/server';

import { validate } from '@/app/helpers/validate';
import { subscriberSchema } from '@/app/helpers/validationSchemas/index';
import { sendEmail } from '@/app/lib';
import type { ApiResponse } from '@/app/lib/server/ApiError';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import { sendTelegramMessage } from '@/app/lib/server/sendTelegram';
import { Subscriber } from '@/app/models/index';
import { EmailTemplateType } from '@/app/templates/email';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'advocate.roschin@gmail.com';

async function verifyRecaptcha(token: string) {
  if (!process.env.RECAPTCHA_SECRET) return; // пропускаем если нет ключа
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
  });
  const data = await res.json();
  if (!data.success) throw new ValidationError('Captcha failed');
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = (await req.json()) as {
      email: string;
      recaptchaToken?: string;
      consent?: boolean;
      website?: string; // honeypot
    };

    // 🐝 Honeypot
    if (body.website) throw new ValidationError('Bot detected');

    // ✅ reCAPTCHA
    if (body.recaptchaToken) await verifyRecaptcha(body.recaptchaToken);

    // ✅ Валидация email и consent
    const data = await validate(subscriberSchema, body);

    // проверяем, есть ли уже подписчик
    let subscriber = await Subscriber.findOne({ email: data.email });
    if (subscriber) {
      if (!subscriber.subscribed) {
        subscriber.subscribed = true;
        await subscriber.save();
      }
    } else {
      subscriber = await Subscriber.create(data);
    }

    // ✉️ Отправка уведомления клиенту
    await sendEmail({
      to: data.email,
      type: EmailTemplateType.SUBSCRIBER_CLIENT,
      props: {
        email: data.email,
      },
    }).catch(console.error);

    // ✉️ Отправка уведомления админу
    await sendEmail({
      to: ADMIN_EMAIL,
      type: EmailTemplateType.SUBSCRIBER_ADMIN,
      props: {
        email: data.email,
      },
    }).catch(console.error);

    // ✉️ Telegram уведомление
    sendTelegramMessage(`🚨 Новый подписчик: ${data.email}`).catch(
      console.error
    );

    return NextResponse.json<ApiResponse<typeof subscriber>>(
      { ok: true, data: subscriber.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
