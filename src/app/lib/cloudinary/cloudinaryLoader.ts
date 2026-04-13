// lib/cloudinary/cloudinaryLoader.ts

export const cloudinaryLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  const q = quality || 'auto';

  const safeWidth = Math.min(width, 1600);

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${q},w_${safeWidth}/${src}`;
};
