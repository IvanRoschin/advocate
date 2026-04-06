import Link from 'next/link';

type CaseStatus =
  | 'new'
  | 'in_progress'
  | 'awaiting_client'
  | 'in_court'
  | 'completed'
  | 'archived';

type ClientCase = {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  createdAt: string;
  updatedAt: string;
};

const cases: ClientCase[] = [
  {
    id: 'case_1',
    title: 'Звернення щодо договору',
    description:
      'Перевірка умов договору, оцінка ризиків та підготовка правової позиції.',
    status: 'in_progress',
    currentStage: 'Аналіз документів',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-04-06T10:30:00.000Z',
  },
  {
    id: 'case_2',
    title: 'Досудове врегулювання спору',
    description:
      'Підготовка претензії, комунікація з іншою стороною та збір матеріалів.',
    status: 'awaiting_client',
    currentStage: 'Очікуємо додаткові документи',
    createdAt: '2026-03-15T11:00:00.000Z',
    updatedAt: '2026-04-04T09:10:00.000Z',
  },
  {
    id: 'case_3',
    title: 'Супровід судової справи',
    description:
      'Підготовка процесуальних документів та представництво інтересів.',
    status: 'in_court',
    currentStage: 'Підготовка до засідання',
    createdAt: '2026-02-11T13:20:00.000Z',
    updatedAt: '2026-04-01T15:00:00.000Z',
  },
  {
    id: 'case_4',
    title: 'Перевірка корпоративних документів',
    description:
      'Аналіз внутрішніх документів компанії та рекомендації щодо змін.',
    status: 'completed',
    currentStage: 'Роботу завершено',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-03-22T12:40:00.000Z',
  },
];

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
    label: 'Очікує клієнта',
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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

const summary = {
  total: cases.length,
  active: cases.filter(item =>
    ['new', 'in_progress', 'awaiting_client', 'in_court'].includes(item.status)
  ).length,
  awaitingClient: cases.filter(item => item.status === 'awaiting_client')
    .length,
  completed: cases.filter(item => item.status === 'completed').length,
};

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

export default function ClientCasesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="border-border bg-card overflow-hidden rounded-[28px] border shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:p-8">
          <div>
            <div className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-violet-600 uppercase dark:text-violet-300">
              Мої справи
            </div>

            <h1 className="text-primary mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
              Юридичні справи та звернення
            </h1>

            <p className="text-secondary mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              Тут зібрані всі ваші справи, поточні етапи роботи та останні
              оновлення. Якщо справа очікує документи або відповідь від вас — це
              буде видно одразу.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/client"
                className="bg-accent inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Назад у кабінет
              </Link>

              <Link
                href="/client/profile"
                className="border-border bg-background text-primary hover:bg-muted inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition"
              >
                Профіль клієнта
              </Link>
            </div>
          </div>

          <div className="border-border bg-background/70 rounded-[24px] border p-5">
            <div className="text-primary text-sm font-semibold">
              Що важливо зараз
            </div>

            <div className="mt-4 space-y-3">
              <div className="border-border bg-card rounded-2xl border p-4">
                <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                  Очікують вашої відповіді
                </div>
                <div className="text-primary mt-2 text-2xl font-semibold">
                  {summary.awaitingClient}
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                <div className="text-primary text-sm font-medium">
                  Рекомендація
                </div>
                <div className="text-secondary mt-2 text-sm leading-6">
                  Регулярно перевіряйте справи зі статусом “Очікує клієнта”, щоб
                  не затримувати наступний етап роботи.
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
          description="Усі справи, доступні у вашому кабінеті."
        />
        <StatCard
          title="Активні"
          value={String(summary.active)}
          description="Нові, в роботі та в судовому процесі."
        />
        <StatCard
          title="Потрібна ваша дія"
          value={String(summary.awaitingClient)}
          description="Справи, де потрібні документи або відповідь."
        />
        <StatCard
          title="Завершені"
          value={String(summary.completed)}
          description="Справи, по яких роботу вже виконано."
        />
      </section>

      <section className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-primary text-xl font-semibold">Список справ</h2>
            <p className="text-secondary mt-1 text-sm leading-6">
              Усі актуальні та завершені процеси, до яких у вас є доступ.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {cases.map(item => (
            <article
              key={item.id}
              className="border-border bg-background/60 rounded-3xl border p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-primary text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-secondary mt-2 max-w-3xl text-sm leading-6">
                    {item.description}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusMeta[item.status].className}`}
                >
                  {statusMeta[item.status].label}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                    Поточний етап
                  </div>
                  <div className="text-primary mt-2 text-sm font-medium">
                    {item.currentStage}
                  </div>
                </div>

                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                    Створено
                  </div>
                  <div className="text-primary mt-2 text-sm font-medium">
                    {formatDate(item.createdAt)}
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
      </section>
    </div>
  );
}
