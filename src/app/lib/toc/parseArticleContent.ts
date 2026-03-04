import * as cheerio from 'cheerio';

import { slugify } from './slugify';

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function parseArticleContent(html: string) {
  const $ = cheerio.load(html);

  const toc: TocItem[] = [];
  const used = new Set<string>();

  $('h2, h3').each((_, el) => {
    const tag = el.tagName;
    const text = $(el).text().trim();

    if (!text) return;

    let id = slugify(text);

    // защита от дублей
    let i = 1;
    while (used.has(id)) {
      id = `${id}-${i++}`;
    }

    used.add(id);

    $(el).attr('id', id);

    toc.push({
      id,
      text,
      level: tag === 'h2' ? 2 : 3,
    });
  });

  return {
    html: $.html(),
    toc,
  };
}
