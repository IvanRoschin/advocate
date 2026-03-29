import { NextResponse } from 'next/server';

import { leadService } from '@/app/lib/services/lead.service';

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await leadService.convertToClient(id);

  return NextResponse.json({
    ok: true,
    data: result,
  });
}
