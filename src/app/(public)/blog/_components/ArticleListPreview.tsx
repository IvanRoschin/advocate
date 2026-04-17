'use client';

import { Calendar, Tag } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

import { imageVariants } from '@/app/config/imageVariants';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { cn, formatDate } from '@/app/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt?: string;
  tags: string[];
  src?: string;
  category?: { id: string; title: string; slug: string };
};

export function ArticleListPreview({
  items,
  baseHref = '/blog',
  className,
}: {
  items: ArticleListItem[];
  baseHref?: string;
  className?: string;
}) {
  const variant = imageVariants.card;

  return (
    <div className={cn('grid gap-4', className)}>
      {items.map((a, index) => {
        const href = `${baseHref}/${a.slug || a.id}`;
        const publicId = a.src ? getCloudinarySrc(a.src) : undefined;
        return (
          <Link
            key={`${a.id}-${index}`}
            href={href}
            className="group block"
            prefetch={false}
          >
            <Card className="border-border bg-card text-card-foreground overflow-hidden transition-all hover:-translate-y-px hover:shadow-lg">
              {' '}
              <CardContent className="p-0">
                <div className="flex flex-col gap-0 sm:flex-row">
                  {/* Cover */}
                  <div className="mt-4 flex h-44 w-full items-center justify-center sm:h-36 sm:w-56">
                    <div className="bg-muted border-border relative mx-4 h-full w-full overflow-hidden rounded-md border">
                      {publicId ? (
                        <CldImage
                          src={publicId}
                          alt={a.title}
                          fill
                          sizes={variant.sizes}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
                          No cover
                        </div>
                      )}
                      <div className="from-background/35 bg-linear-to-top pointer-events-none absolute inset-0 to-transparent" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.category?.title ? (
                        <Badge variant="secondary" className="truncate">
                          {a.category.title}
                        </Badge>
                      ) : null}

                      {a.publishedAt ? (
                        <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(a.publishedAt)}
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          draft
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-accent line-clamp-2 text-base leading-snug font-semibold tracking-tight sm:text-lg">
                      {a.title}
                    </h3>

                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {a.summary}
                    </p>

                    {/* Tags */}
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {a.tags?.length ? (
                        <>
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                            <Tag className="h-3.5 w-3.5" />
                            <span className="sr-only">Tags</span>
                          </span>
                          {a.tags.slice(0, 4).map(t => (
                            <Badge
                              key={t}
                              variant="outline"
                              className="text-xs"
                            >
                              {t}
                            </Badge>
                          ))}
                          {a.tags.length > 4 ? (
                            <span className="text-muted-foreground text-xs">
                              +{a.tags.length - 4}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Без тегів
                        </span>
                      )}
                    </div>

                    <div className="text-accent mt-2 text-sm font-medium underline-offset-4 group-hover:underline">
                      Читати →
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
