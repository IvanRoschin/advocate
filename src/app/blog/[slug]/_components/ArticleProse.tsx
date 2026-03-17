import { cn } from '@/lib/utils';

export default function ArticleProse({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-article
      className={cn(
        // prose можно заменить на твои классы
        'prose prose-neutral max-w-none',
        // important: комфортные отступы для якорей
        'prose-h2:scroll-mt-24 prose-h3:scroll-mt-24',
        'prose-h2:mt-10 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2',
        className
      )}
    >
      {children}
    </div>
  );
}
