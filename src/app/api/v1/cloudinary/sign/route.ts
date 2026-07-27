import { NextResponse } from 'next/server';

import { requireAdmin } from '@/app/lib/auth/requireAdmin';
import { getCloudinary } from '@/app/lib/cloudinary/getCloudinary';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';

type Body = {
  paramsToSign?: Record<string, string | number>;
};

// Only these keys are ever allowed into the signature — prevents a caller
// from signing arbitrary overwrite/public_id/eager params.
const ALLOWED_PARAM_KEYS = new Set([
  'timestamp',
  'folder',
  'public_id',
  'upload_preset',
  'tags',
]);

function pickAllowedParams(paramsToSign: Record<string, string | number>) {
  const picked: Record<string, string | number> = {};

  for (const key of Object.keys(paramsToSign)) {
    if (ALLOWED_PARAM_KEYS.has(key)) {
      picked[key] = paramsToSign[key];
    }
  }

  if (!picked.timestamp) {
    throw new ValidationError('timestamp is required');
  }

  return picked;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = (await request.json()) as Body;

    if (!body.paramsToSign || typeof body.paramsToSign !== 'object') {
      throw new ValidationError('paramsToSign is required');
    }

    const safeParams = pickAllowedParams(body.paramsToSign);

    const cloudinary = getCloudinary();

    const signature = cloudinary.utils.api_sign_request(
      safeParams,
      cloudinary.config().api_secret! as string
    );

    return NextResponse.json({ signature, params: safeParams });
  } catch (err) {
    return errorToResponse(err);
  }
}
