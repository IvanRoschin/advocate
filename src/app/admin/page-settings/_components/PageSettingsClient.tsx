'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { Breadcrumbs, Btn, Switcher } from '@/components';

import type { PageLayoutNode, PageSettingsResponseDTO } from '@/app/types';

type Props = {
  initialSettings: PageSettingsResponseDTO;
};

const ENTITY_META = {
  article: {
    label: 'Статті',
    description: 'Глобальний layout для всіх сторінок статей.',
    href: '/admin/page-settings/article',
  },
  service: {
    label: 'Послуги',
    description: 'Глобальний layout для всіх сторінок послуг.',
    href: '/admin/page-settings/service',
  },
} as const;

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero секція',
  content: 'Основний контент',
  share: 'Поширення',
  related: 'Схожі матеріали',
  toc: 'Зміст',
  reviews: 'Відгуки',
  benefits: 'Переваги',
  process: 'Процес',
  faq: 'Поширені питання',
  cta: 'Заклик до дії',
};

const GROUP_LABELS: Record<string, string> = {
  articleMainContent: 'Основний блок статті',
  serviceMainContent: 'Основний блок послуги',
};

const getNodeTitle = (key: string, type: 'section' | 'group') => {
  if (type === 'group') {
    return GROUP_LABELS[key] ?? key;
  }

  return SECTION_LABELS[key] ?? key;
};

const getNodeDescription = (node: PageLayoutNode) => {
  if (node.type === 'group') {
    return `Група з ${node.items.length} вкладених секцій`;
  }

  return 'Окрема секція сторінки';
};

const togglePageLayoutNode = (
  layout: PageLayoutNode[],
  targetKey: string,
  itemKey?: string
): PageLayoutNode[] =>
  layout.map(node => {
    if (node.key !== targetKey) return node;

    if (node.type === 'section') {
      return { ...node, display: !node.display };
    }

    if (itemKey) {
      return {
        ...node,
        items: node.items.map(item =>
          item.key === itemKey ? { ...item, display: !item.display } : item
        ),
      };
    }

    return { ...node, display: !node.display };
  });

const layoutsEqual = (a: PageLayoutNode[], b: PageLayoutNode[]) =>
  JSON.stringify(a) === JSON.stringify(b);

export default function PageSettingsClient({ initialSettings }: Props) {
  const [layout, setLayout] = useState<PageLayoutNode[]>(
    initialSettings.layout
  );
  const [isSaving, setIsSaving] = useState(false);

  const entityMeta = ENTITY_META[initialSettings.entity];
  const isDirty = useMemo(
    () => !layoutsEqual(layout, initialSettings.layout),
    [layout, initialSettings.layout]
  );

  const enabledCount = useMemo(() => {
    return layout.reduce((total, node) => {
      if (node.type === 'section') {
        return total + (node.display ? 1 : 0);
      }

      return (
        total +
        node.items.reduce((sum, item) => sum + (item.display ? 1 : 0), 0)
      );
    }, 0);
  }, [layout]);

  const totalCount = useMemo(() => {
    return layout.reduce((total, node) => {
      if (node.type === 'section') return total + 1;
      return total + node.items.length;
    }, 0);
  }, [layout]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await apiFetch(
        apiUrl(`/api/admin/page-settings/${initialSettings.entity}`),
        {
          method: 'PUT',
          body: JSON.stringify({ layout }),
        }
      );

      toast.success('Налаштування сторінки оновлено');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Помилка збереження налаштувань'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLayout(initialSettings.layout);
    toast.success('Зміни скинуто');
  };

  return (
    <div className="container space-y-6 py-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-accent text-2xl font-semibold">
            Налаштування сторінок
          </h1>

          <p className="text-muted-foreground text-sm">
            {entityMeta.description}
          </p>

          <div className="text-muted-foreground text-sm">
            Активно секцій: {enabledCount} з {totalCount}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Btn
            label="Скинути"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
          />

          <Btn
            label={isSaving ? 'Збереження...' : 'Зберегти'}
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.values(ENTITY_META).map(item => {
          const isActive = item.href === entityMeta.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                isActive
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {isDirty ? (
        <div className="border-accent/30 bg-accent/5 rounded-2xl border px-4 py-3 text-sm">
          Є незбережені зміни.
        </div>
      ) : null}

      <div className="space-y-5">
        {layout.map(node => (
          <div
            key={node.key}
            className="bg-card space-y-4 rounded-2xl border p-5 shadow-sm"
          >
            <Switcher
              id={`node-${node.key}`}
              checked={node.display}
              onChange={() =>
                setLayout(prev => togglePageLayoutNode(prev, node.key))
              }
              label={getNodeTitle(node.key, node.type)}
              description={getNodeDescription(node)}
              labels={['Приховано', 'Показано']}
            />

            {node.type === 'group' ? (
              <div className="border-border space-y-3 rounded-xl border p-4">
                <div className="text-sm font-medium">Вкладені секції</div>

                <div className="space-y-3">
                  {node.items.map(item => (
                    <Switcher
                      key={item.key}
                      id={`node-${node.key}-${item.key}`}
                      checked={item.display}
                      onChange={() =>
                        setLayout(prev =>
                          togglePageLayoutNode(prev, node.key, item.key)
                        )
                      }
                      label={SECTION_LABELS[item.key] ?? item.key}
                      description="Керує видимістю секції на сторінці"
                      labels={['Приховано', 'Показано']}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
