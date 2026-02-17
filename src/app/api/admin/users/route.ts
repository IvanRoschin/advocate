import { NextResponse } from 'next/server';

import { routes } from '@/app/config';
import { sendEmail } from '@/app/lib';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { EmailTemplateType } from '@/app/templates/email';
import { CreateUserRequestDTO, createUserSchema } from '@/app/types';
import { userService } from '@/lib/services/user.service';

const ADMIN_EMAIL = 'advocate.roschin@gmail.com';

export async function GET() {
  try {
    await connectDB();
    const users = await userService.getAll();

    return NextResponse.json({ ok: true, data: users });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const data: CreateUserRequestDTO = await createUserSchema.validate(body, {
      abortEarly: false,
    });

    const { user, verificationToken } = await userService.create(data);

    await sendEmail({
      to: user.email,
      type: EmailTemplateType.VERIFICATION,
      props: {
        name: user.name,
        verificationUrl: `${routes.public.home}/verify?token=${verificationToken}`,
      },
    }).catch(console.error);

    await sendEmail({
      to: ADMIN_EMAIL,
      type: EmailTemplateType.USER_CREATED,
      props: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    }).catch(console.error);

    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    return errorToResponse(err);
  }
}
