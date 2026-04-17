const CLOUDINARY_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1600];

const getCloudName = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  return cloudName;
};

export const buildCloudinaryUrl = (
  publicId: string,
  opts?: {
    width?: number;
    quality?: number | 'auto';
  }
) => {
  const cloudName = getCloudName();

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
