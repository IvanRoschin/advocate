import { v2 as cloudinary } from 'cloudinary';

import { serverEnv } from '../server/env/serverEnv';

let initialized = false;

export function getCloudinary() {
  if (!initialized) {
    cloudinary.config({
      cloud_name: serverEnv.cloudinary.cloudName,
      api_key: serverEnv.cloudinary.apiKey,
      api_secret: serverEnv.cloudinary.apiSecret,
      secure: true,
    });

    initialized = true;
  }

  return cloudinary;
}
