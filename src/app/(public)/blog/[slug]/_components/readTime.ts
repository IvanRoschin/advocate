export function estimateReadTimeFromHtml(html: string, wpm = 220) {
  const text = html
    .replace(/<[^>]+>/g, ' ') // strip tags
    .replace(/\s+/g, ' ')
    .trim();

  const words = text ? text.split(' ').length : 0;
  const minutes = Math.max(1, Math.ceil(words / wpm));

  return { words, minutes };
}
