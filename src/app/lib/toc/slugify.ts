export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\wа-яіїєґ\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
