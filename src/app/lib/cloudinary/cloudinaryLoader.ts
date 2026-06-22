import { env } from '../server/env/serverEnv';

export const cloudinaryLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const cloudName = env.cloudinary.cloudName;

  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing');
  }

  const q = quality || 'auto';

  const safeWidth = Math.min(width, 1600);

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${q},w_${safeWidth}/${src}`;
};
