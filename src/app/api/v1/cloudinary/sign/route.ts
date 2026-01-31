import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type Body = {
  paramsToSign: Record<string, string | number>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

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
