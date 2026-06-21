import { env } from '../server/env/serverEnv';

const CLOUDINARY_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1600];

export const buildCloudinaryUrl = (
  publicId: string,
  opts?: {
    width?: number;
    quality?: number | 'auto';
  }
) => {
  const cloudName = env.cloudinary.cloudName;

  const width = opts?.width ?? 1200;
  const quality = opts?.quality ?? 'auto';

  const safeWidth = Math.min(width, 1600);

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${quality},w_${safeWidth}/${publicId}`;
};

export const buildCloudinarySrcSet = (publicId: string) => {
  return CLOUDINARY_WIDTHS.map(
    w => `${buildCloudinaryUrl(publicId, { width: w })} ${w}w`
  ).join(', ');
};
