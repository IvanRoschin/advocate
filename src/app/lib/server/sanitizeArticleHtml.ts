import 'server-only';

import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes rich-text article HTML before it's stored, so
 * dangerouslySetInnerHTML on the public blog page can't be turned into
 * stored XSS via the admin article editor.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'span',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      '*': ['id', 'class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
