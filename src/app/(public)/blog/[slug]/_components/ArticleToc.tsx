'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/app/lib/utils';
import { iconLibrary } from '@/app/resources';

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const BlogIcon = iconLibrary.blog;

  const ids = useMemo(() => items.map(i => i.id), [items]);

  const [activeId, setActiveId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.location.hash?.slice(1);
    if (!raw) return null;

    const hash = decodeURIComponent(raw);
    // ids тут уже доступны (useMemo выше), но на первом рендере SSR будет []
    return ids.includes(hash) ? hash : null;
  });

  useEffect(() => {
    if (!ids.length) return;

    const headings = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const ratios = new Map<string, number>();

    const pickBest = () => {
      let bestId: string | null = null;
      let bestRatio = 0;

      for (const el of headings) {
        const r = ratios.get(el.id) ?? 0;

        if (r > bestRatio) {
          bestRatio = r;
          bestId = el.id;
        } else if (r === bestRatio && r > 0 && bestId) {
          const a = el.getBoundingClientRect().top;
          const b =
            document.getElementById(bestId)?.getBoundingClientRect().top ??
            Infinity;
          if (a < b) bestId = el.id;
        }
      }

      if (bestId) {
        setActiveId(prev => (prev === bestId ? prev : bestId));
      }
    };

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          ratios.set(
            (e.target as HTMLElement).id,
            e.isIntersecting ? e.intersectionRatio : 0
          );
        }
        pickBest();
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach(h => io.observe(h));
    return () => io.disconnect();
  }, [ids]);

  // ✅ ранний return — только после хуков
  if (!items.length) return null;

  return (
    <aside className="border-accent space-y-4 pl-4 lg:border-l">
      <div className="text-accent flex items-center gap-2 text-base font-semibold tracking-tight">
        <BlogIcon className="h-4 w-4" />
        <span>Зміст</span>
      </div>

      <nav>
        <ul className="space-y-2">
          {items.map(item => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id} className={cn(item.level === 3 && 'pl-4')}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'block text-[15px] leading-relaxed transition-colors',
                    isActive
                      ? 'font-medium text-[#b89b5e]'
                      : 'text-muted-foreground hover:text-[#b89b5e]'
                  )}
                  onClick={() => setActiveId(item.id)} // ⚡ мгновенная подсветка при клике
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
