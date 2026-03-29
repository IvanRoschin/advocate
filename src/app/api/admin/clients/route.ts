import { NextResponse } from 'next/server';

import { ApiResponse } from '@/app/lib/server/ApiError';
import { clientService } from '@/app/lib/services/client.service';
import type { ClientResponseDTO, CreateClientDTO } from '@/app/types';
export async function GET() {
  const clients = await clientService.getAll();

  return NextResponse.json<ApiResponse<ClientResponseDTO[]>>({
    ok: true,
    data: clients,
  });
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateClientDTO;

  const client = await clientService.create(body);

  return NextResponse.json<ApiResponse<ClientResponseDTO>>(
    {
      ok: true,
      data: client,
    },
    { status: 201 }
  );
}
