import { NextResponse } from 'next/server';

import { clientActions } from '@/app/actions/client.actions';
import { ApiResponse } from '@/app/lib/server/ApiError';

import type { ClientResponseDTO, CreateClientDTO } from '@/app/types';
export async function GET() {
  const result = await clientActions.getAll();

  return NextResponse.json<ApiResponse<ClientResponseDTO[]>>({
    ok: true,
    data: result.items,
  });
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateClientDTO;

  const client = await clientActions.create(body);

  return NextResponse.json<ApiResponse<ClientResponseDTO>>(
    {
      ok: true,
      data: client,
    },
    { status: 201 }
  );
}
