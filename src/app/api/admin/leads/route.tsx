import { NextResponse } from 'next/server';

import { leadActions } from '@/app/actions/lead.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET() {
  try {
    const result = await leadActions.getAll();
    const leads = result.items;

    return NextResponse.json({ ok: true, data: leads });
  } catch (err) {
    return errorToResponse(err);
  }
}
