import { extractPublicId } from './extractPublicId';

export function getCloudinarySrc(src?: string) {
  if (!src) return '';

  return src.startsWith('http') ? extractPublicId(src) : src;
}
