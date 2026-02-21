'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

import { routes } from '@/app/config/routes';
import { AppLink } from '@/components';

type DynamicSegmentData = {
  name: string;
  href?: string;
};

/**
 * Пользовательские названия для сегментов
 */
const customNames: Record<string, string> = {
  category: 'Категорія',
  services: 'Послуги',
  contact: 'Контакти',
  admin: 'Адмінка',
  users: 'Адміни',
  categories: 'Категорії',
  testimonials: 'Відгуки',
  slider: 'Слайди',
  search: 'Пошук',
};

/**
 * Простой capitalize
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface BreadcrumbsProps {
  /**
   * Callback для получения динамических данных по последнему сегменту (например, товар)
   */
  fetchDynamicSegment?: (id: string) => Promise<DynamicSegmentData | null>;
}

const Breadcrumbs = ({ fetchDynamicSegment }: BreadcrumbsProps) => {
  const pathname = usePathname();
  const [dynamicSegment, setDynamicSegment] =
    useState<DynamicSegmentData | null>(null);

  // Сегменты пути
  const segments = useMemo(
    () =>
      pathname
        .split('/')
        .filter(Boolean)
        .map(seg => decodeURIComponent(seg)),
    [pathname]
  );

  // Если последний сегмент может быть динамическим (например, ObjectId)
  useEffect(() => {
    const last = segments[segments.length - 1];
    let mounted = true;

    // Асинхронная функция для обновления состояния
    const fetchSegment = async () => {
      // Если не нужно динамического сегмента — просто обнуляем
      if (!last || !fetchDynamicSegment || !/^[0-9a-fA-F]{24}$/.test(last)) {
        if (mounted) setDynamicSegment(null);
        return;
      }

      try {
        const data = await fetchDynamicSegment(last);
        if (mounted) setDynamicSegment(data);
      } catch (error) {
        console.error('❌ Breadcrumbs dynamic fetch error', error);
        if (mounted) setDynamicSegment(null);
      }
    };

    fetchSegment();

    return () => {
      mounted = false;
    };
  }, [segments, fetchDynamicSegment]);

  // Формируем хлебные крошки
  const crumbs = useMemo(() => {
    return segments.map((segment, idx) => {
      const isLast = idx === segments.length - 1;
      const href = '/' + segments.slice(0, idx + 1).join('/');
      let name = customNames[segment] || capitalize(segment.replace(/-/g, ' '));

      if (isLast && dynamicSegment?.name) name = dynamicSegment.name;

      return { name, href };
    });
  }, [segments, dynamicSegment]);

  return (
    <nav aria-label="breadcrumbs" className="mb-4 text-sm text-gray-600">
      <ol className="flex flex-wrap items-center space-x-2">
        <li>
          <AppLink
            href={routes.public.home}
            className="nav text-gray-600 hover:text-gray-600"
          >
            Головна
          </AppLink>
        </li>

        {crumbs.map((crumb, idx) => (
          <li key={crumb.href + idx} className="flex items-center space-x-2">
            <FaChevronRight className="mx-1 text-xs text-gray-400" />
            <AppLink
              href={crumb.href}
              className="nav text-gray-600 hover:text-gray-600"
            >
              {crumb.name}
            </AppLink>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
