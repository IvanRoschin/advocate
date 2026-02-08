import { NextResponse } from 'next/server';

import { validate } from '@/app/helpers/validate';
import leadSchema from '@/app/helpers/validationSchemas/lead.schema';
import { leadAdminTemplate, leadClientTemplate } from '@/app/lib/mailTemplates';
import { sendMail } from '@/app/lib/sendMail';
import { sendTelegramMessage } from '@/app/lib/sendTelegram';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { connectDB } from '@/app/lib/server/mongoose';
import { Lead } from '@/models';

import type { ApiResponse } from '@/app/lib/server/ApiError';
const ADMIN_EMAIL = 'advocate.roschin@gmail.com';

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET!;
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });
  const data = await res.json();
  if (!data.success) throw new ValidationError('Captcha failed');
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as {
      name: string;
      email: string;
      phone: string;
      consent: boolean;
      website?: string;
      recaptchaToken: string;
    };

    // 🐝 Honeypot
    if (body.website) throw new ValidationError('Bot detected');

    // ✅ reCAPTCHA v2
    if (!body.recaptchaToken)
      throw new ValidationError('Captcha token missing');
    await verifyRecaptcha(body.recaptchaToken);

    const data = await validate(leadSchema, body);

    const lead = await Lead.create(data);

    // ✉️ письма клиенту и админу
    sendMail({
      to: data.email,
      subject: 'Ми отримали вашу заявку',
      body: leadClientTemplate({ name: data.name }),
    }).catch(console.error);

    sendMail({
      to: ADMIN_EMAIL,
      subject: '🚨 Новий лід з сайту',
      body: leadAdminTemplate({
        name: data.name,
        email: data.email,
        phone: data.phone,
      }),
    }).catch(console.error);

    // ✉️ Telegram
    sendTelegramMessage(
      `🚨 <b>Новий лід</b>\nІм'я: ${data.name}\nEmail: ${data.email}\nТелефон: ${data.phone}`
    ).catch(console.error);

    return NextResponse.json<ApiResponse<typeof lead>>(
      { ok: true, data: lead.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
