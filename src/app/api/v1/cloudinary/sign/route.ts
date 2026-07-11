import { NextResponse } from 'next/server';

import { getCloudinary } from '@/app/lib/cloudinary/getCloudinary';

type Body = {
  paramsToSign: Record<string, string | number>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const cloudinary = getCloudinary();

  const { paramsToSign } = body;
  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret! as string
    );

    return NextResponse.json({
      signature,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
