import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { tokenService } from '@/app/lib/services/token.service';
import { TokenType, VerifyTokenDTO } from '@/app/types';

export async function POST(req: Request) {
  try {
    const { token }: VerifyTokenDTO = await req.json();
    if (!token)
      return NextResponse.json({ success: false, message: 'Token missing' });

    const tokenDoc = await tokenService.verify(token);
    if (!tokenDoc)
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      });

    if (tokenDoc.type === TokenType.EMAIL_CHANGE) {
      const user = await tokenService.changeEmail(tokenDoc);
      return NextResponse.json({
        success: true,
        message: 'Email changed',
        user,
      });
    }

    if (tokenDoc.type === TokenType.VERIFICATION) {
      const user = await tokenService.activateAccount(tokenDoc);
      return NextResponse.json({
        success: true,
        message: 'Account activated',
        user,
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown token type' });
  } catch (err) {
    return errorToResponse(err);
  }
}
