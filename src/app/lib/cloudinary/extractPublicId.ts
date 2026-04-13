// lib/cloudinary/extractPublicId.ts

export function extractPublicId(src: string): string {
  if (!src) return '';

  // якщо вже publicId
  if (!src.startsWith('http')) return src;

  try {
    const url = new URL(src);

    const parts = url.pathname.split('/');

    const uploadIndex = parts.findIndex(p => p === 'upload');

    if (uploadIndex === -1) return src;

    // відрізаємо все до upload + версію
    const publicParts = parts.slice(uploadIndex + 2);

    return publicParts.join('/').replace(/\.[^/.]+$/, '');
  } catch {
    return src;
  }
}
