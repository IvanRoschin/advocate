import Link from 'next/link';

import type {
  CaseStatus,
  ClientDashboardAccessDto,
  ClientDashboardCaseDto,
  ClientDashboardOverviewDto,
} from '@/app/types';

type Props = {
  data: ClientDashboardOverviewDto;
};

const statusMeta: Record<CaseStatus, { label: string; className: string }> = {
  new: {
    label: 'Нова',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  },
  in_progress: {
    label: 'У роботі',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  awaiting_client: {
    label: 'Потрібні дії клієнта',
    className:
      'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  },
  in_court: {
    label: 'У суді',
    className:
      'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
  completed: {
    label: 'Завершена',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  archived: {
    label: 'Архів',
    className:
      'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300',
  },
};

const accessRoleMeta: Record<ClientDashboardAccessDto['accessRole'], string> = {
  owner: 'Власник кабінету',
  manager: 'Менеджер',
  viewer: 'Перегляд',
};

const formatDate = (value?: string) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const getCasesSummary = (cases: ClientDashboardCaseDto[]) => {
  const total = cases.length;
  const active = cases.filter(
    item =>
      item.status === 'new' ||
      item.status === 'in_progress' ||
      item.status === 'awaiting_client' ||
      item.status === 'in_court'
  ).length;
  const awaitingClient = cases.filter(
    item => item.status === 'awaiting_client'
  ).length;
  const completed = cases.filter(item => item.status === 'completed').length;

  return { total, active, awaitingClient, completed };
};

const getProfileCompleteness = (
  client: ClientDashboardOverviewDto['client']
) => {
  const fields = [
    client.fullName,
    client.email,
    client.phone,
    client.address ?? '',
    client.companyName ?? '',
    client.taxId ?? '',
  ];

  const filled = fields.filter(value => value.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border-border bg-background/60 flex flex-col gap-1 rounded-2xl border p-4">
    <span className="text-secondary text-xs font-medium tracking-[0.16em] uppercase">
      {label}
    </span>
    <span className="text-primary text-sm leading-6">{value}</span>
  </div>
);

const StatCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) => (
  <div className="border-border bg-card rounded-3xl border p-5 shadow-sm">
    <div className="text-secondary text-sm font-medium">{title}</div>
    <div className="text-primary mt-3 text-3xl font-semibold tracking-tight">
      {value}
    </div>
    <div className="text-secondary mt-2 text-sm leading-6">{description}</div>
  </div>
);

export default function ClientPage({ data }: Props) {
  const summary = getCasesSummary(data.cases);
  const profileCompleteness = getProfileCompleteness(data.client);

  const hasProfileGaps =
    !data.client.address?.trim() ||
    (data.client.type === 'company' &&
      (!data.client.companyName?.trim() || !data.client.taxId?.trim()));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="border-border bg-card overflow-hidden rounded-[28px] border shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.3fr)_360px] lg:p-8">
          <div className="min-w-0">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-emerald-600 uppercase dark:text-emerald-300">
              Особистий кабінет клієнта
            </div>

            <h1 className="text-primary mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
              Вітаємо, {data.client.fullName}
            </h1>

            <p className="text-secondary mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              Тут зібрана ключова інформація по вашому профілю, доступу до
              кабінету та актуальних справах. Ви можете швидко перевірити статус
              роботи та оновити контактні дані.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/client/profile"
                className="bg-accent inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Редагувати профіль
              </Link>

              <Link
                href="/client/cases"
                className="border-border bg-background text-primary hover:bg-muted inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition"
              >
                Переглянути всі справи
              </Link>

              <Link
                href="/contacts"
                className="border-border bg-background text-primary hover:bg-muted inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition"
              >
                Звʼязатися з адвокатом
              </Link>
            </div>
          </div>

          <div className="border-border bg-background/70 rounded-[24px] border p-5">
            <div className="text-primary text-sm font-semibold">
              Стан кабінету
            </div>

            <div className="mt-4 space-y-4">
              <div className="border-border bg-card rounded-2xl border p-4">
                <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                  Рівень заповнення профілю
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="text-primary text-2xl font-semibold">
                    {profileCompleteness}%
                  </div>
                  <div className="text-secondary text-xs">
                    {hasProfileGaps
                      ? 'Є дані, які варто доповнити'
                      : 'Профіль заповнено добре'}
                  </div>
                </div>
                <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                    Доступ
                  </div>
                  <div className="text-primary mt-2 text-sm font-medium">
                    {accessRoleMeta[data.access.accessRole]}
                  </div>
                </div>

                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                    Статус
                  </div>
                  <div className="text-primary mt-2 text-sm font-medium">
                    {data.access.isActive ? 'Активний' : 'Неактивний'}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                <div className="text-primary text-sm font-medium">
                  Потрібна ваша увага
                </div>
                <div className="text-secondary mt-2 text-sm leading-6">
                  {summary.awaitingClient > 0
                    ? `У вас ${summary.awaitingClient} справ(и), де очікуються документи або відповідь з вашого боку.`
                    : 'Наразі немає справ, які потребують термінової відповіді з вашого боку.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Усього справ"
          value={String(summary.total)}
          description="Всі справи, доступні у вашому кабінеті."
        />
        <StatCard
          title="Активні"
          value={String(summary.active)}
          description="Нові, поточні, судові та в роботі."
        />
        <StatCard
          title="Очікують вас"
          value={String(summary.awaitingClient)}
          description="Справи, де потрібні документи або відповідь."
        />
        <StatCard
          title="Завершені"
          value={String(summary.completed)}
          description="Справи, по яких роботу вже завершено."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <div className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-primary text-xl font-semibold">Мої справи</h2>
              <p className="text-secondary mt-1 text-sm leading-6">
                Останні оновлення по ваших зверненнях та юридичних процесах.
              </p>
            </div>

            <Link
              href="/client/cases"
              className="text-accent text-sm font-medium hover:opacity-80"
            >
              Усі справи
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {data.cases.map(item => (
              <article
                key={item.id}
                className="border-border bg-background/60 rounded-3xl border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-primary text-base font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-secondary mt-2 text-sm leading-6">
                      {item.description || 'Опис справи буде додано пізніше.'}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusMeta[item.status].className}`}
                  >
                    {statusMeta[item.status].label}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="border-border bg-card rounded-2xl border p-4">
                    <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                      Поточний етап
                    </div>
                    <div className="text-primary mt-2 text-sm font-medium">
                      {item.currentStage || 'Без уточнення'}
                    </div>
                  </div>

                  <div className="border-border bg-card rounded-2xl border p-4">
                    <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                      Оновлено
                    </div>
                    <div className="text-primary mt-2 text-sm font-medium">
                      {formatDate(item.updatedAt)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-primary text-xl font-semibold">
                  Профіль клієнта
                </h2>
                <p className="text-secondary mt-1 text-sm leading-6">
                  Основні контактні та реєстраційні дані.
                </p>
              </div>

              <Link
                href="/client/profile"
                className="text-accent text-sm font-medium hover:opacity-80"
              >
                Редагувати
              </Link>
            </div>

            <div className="mt-6 grid gap-3">
              <InfoRow label="ПІБ" value={data.client.fullName} />
              <InfoRow label="Email" value={data.client.email} />
              <InfoRow label="Телефон" value={data.client.phone} />
              <InfoRow
                label="Адреса"
                value={data.client.address?.trim() || 'Не вказано'}
              />
              <InfoRow
                label="Тип клієнта"
                value={
                  data.client.type === 'company'
                    ? 'Юридична особа'
                    : 'Фізична особа'
                }
              />

              {data.client.type === 'company' ? (
                <>
                  <InfoRow
                    label="Компанія"
                    value={data.client.companyName?.trim() || 'Не вказано'}
                  />
                  <InfoRow
                    label="ЄДРПОУ / ІПН"
                    value={data.client.taxId?.trim() || 'Не вказано'}
                  />
                </>
              ) : null}
            </div>
          </section>

          <section className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
            <h2 className="text-primary text-xl font-semibold">Швидкі дії</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/client/profile"
                className="border-border bg-background text-primary hover:bg-muted rounded-2xl border px-4 py-3 text-sm font-medium transition"
              >
                Оновити контактні дані
              </Link>

              <Link
                href="/client/cases"
                className="border-border bg-background text-primary hover:bg-muted rounded-2xl border px-4 py-3 text-sm font-medium transition"
              >
                Перейти до моїх справ
              </Link>

              <Link
                href="/contacts"
                className="border-border bg-background text-primary hover:bg-muted rounded-2xl border px-4 py-3 text-sm font-medium transition"
              >
                Написати або зателефонувати
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
