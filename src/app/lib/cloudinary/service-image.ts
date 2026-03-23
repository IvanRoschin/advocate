export type ServiceImageVariant = 'card' | 'hero';

export function getServiceImageUrl(
  publicIdOrUrl: string,
  variant: ServiceImageVariant
): string {
  if (!publicIdOrUrl) return '';

  if (publicIdOrUrl.startsWith('http')) {
    return publicIdOrUrl;
  }

  switch (variant) {
    case 'card':
      return buildCloudinaryUrl(
        publicIdOrUrl,
        'w_840,h_525,c_fill,g_auto,f_auto,q_auto'
      );

    case 'hero':
      return buildCloudinaryUrl(
        publicIdOrUrl,
        'w_840,h_1000,c_fill,g_auto,f_auto,q_auto'
      );
  }
}

function buildCloudinaryUrl(publicId: string, transform: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}
