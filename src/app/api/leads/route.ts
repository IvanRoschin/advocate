import { NextResponse } from 'next/server';

import { validate } from '@/app/helpers/validate';
import leadSchema from '@/app/helpers/validation-schemas/lead-schema';
import { ValidationError } from '@/app/lib/errors/http-errors';
import { leadAdminTemplate } from '@/app/lib/mail-templates/lead-admin';
import { leadClientTemplate } from '@/app/lib/mail-templates/lead-client';
import { sendMail } from '@/app/lib/send-mail';
import { LeadDocument, LeadInput } from '@/app/models/Lead';
import { errorToResponse } from '@/lib/errors/error-to-response';
import { connectDB } from '@/lib/mongoose';
import { Lead } from '@/models';

import type { ApiResponse } from '@/lib/api-response';
const ADMIN_EMAIL = 'advocate.roschin@gmail.com';

export async function POST(req: Request) {
  try {
    await connectDB();

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      throw new ValidationError('Invalid JSON body');
    }

    const data = await validate<LeadInput>(leadSchema, body);

    const lead = await Lead.create(data);

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

    return NextResponse.json<ApiResponse<LeadDocument>>(
      { ok: true, data: lead.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
