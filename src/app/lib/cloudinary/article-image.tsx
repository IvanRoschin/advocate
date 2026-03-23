import { Cloudinary } from '@cloudinary/url-gen';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!cloudName) {
  throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
}

const cld = new Cloudinary({
  cloud: { cloudName },
});

export type ArticleImageVariant = 'card' | 'hero';

export function getArticleImageUrl(
  publicIdOrUrl: string,
  variant: ArticleImageVariant
): string {
  if (!publicIdOrUrl) return '';

  // 🔥 временный fallback если у тебя в БД URL
  if (publicIdOrUrl.startsWith('http')) {
    return publicIdOrUrl;
  }

  const img = cld.image(publicIdOrUrl);

  switch (variant) {
    case 'card':
      img.resize(fill().width(448).height(288).gravity(autoGravity()));
      break;

    case 'hero':
      img.resize(fill().width(1800).height(788).gravity(autoGravity()));
      break;
  }

  img.delivery(format(autoFormat()));
  img.delivery(quality(autoQuality()));

  return img.toURL();
}
