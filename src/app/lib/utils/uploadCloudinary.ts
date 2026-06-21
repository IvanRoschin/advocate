import { env } from '../server/env/serverEnv';

export const uploadCloudinary = async (file: File) => {
  if (!file) {
    return;
  }
  const cloudName = env.cloudinary.cloudName;
  const data = new FormData();

  data.append('file', file);
  data.append('upload_preset', env.cloudinary.uploadPreset ?? '');
  data.append('cloud_name', cloudName ?? '');
  data.append('folder', 'Cloudinary-React');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );
    const res = await response.json();
    return { publicId: res?.public_id, url: res?.secure_url };
  } catch (error) {
    console.warn(error);
  }
};
