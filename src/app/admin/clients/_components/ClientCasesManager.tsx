'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type {
  AdminClientCaseDto,
  CaseStatus,
  CreateCaseDTO,
} from '@/app/types';

type Props = {
  clientId: string;
  initialCases: AdminClientCaseDto[];
};

type EditableCase = {
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
};

const CASE_STATUS_OPTIONS: Array<{ value: CaseStatus; label: string }> = [
  { value: 'new', label: 'Нова' },
  { value: 'in_progress', label: 'У роботі' },
  { value: 'awaiting_client', label: 'Очікує клієнта' },
  { value: 'in_court', label: 'У суді' },
  { value: 'completed', label: 'Завершена' },
  { value: 'archived', label: 'Архів' },
];

const statusBadgeClassMap: Record<CaseStatus, string> = {
  new: 'bg-sky-100 text-sky-700',
  in_progress: 'bg-amber-100 text-amber-700',
  awaiting_client: 'bg-rose-100 text-rose-700',
  in_court: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-zinc-100 text-zinc-700',
};

const formatDate = (value?: string) => {
  if (!value) return '—';

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);
};

const getStatusLabel = (status: CaseStatus) =>
  CASE_STATUS_OPTIONS.find(option => option.value === status)?.label ?? status;

const createEditableCase = (item: AdminClientCaseDto): EditableCase => ({
  title: item.title,
  description: item.description,
  status: item.status,
  currentStage: item.currentStage,
});

export default function ClientCasesManager({ clientId, initialCases }: Props) {
  const [cases, setCases] = useState<AdminClientCaseDto[]>(initialCases);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [savingCaseId, setSavingCaseId] = useState<string | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);

  const [draft, setDraft] = useState<CreateCaseDTO>({
    title: '',
    description: '',
    status: 'new',
    currentStage: 'Первинний аналіз',
  });

  const [editingValues, setEditingValues] = useState<EditableCase>({
    title: '',
    description: '',
    status: 'new',
    currentStage: '',
  });

  const summary = useMemo(() => {
    return {
      total: cases.length,
      active: cases.filter(item =>
        ['new', 'in_progress', 'awaiting_client', 'in_court'].includes(
          item.status
        )
      ).length,
      completed: cases.filter(item => item.status === 'completed').length,
    };
  }, [cases]);

  const resetDraft = () => {
    setDraft({
      title: '',
      description: '',
      status: 'new',
      currentStage: 'Первинний аналіз',
    });
  };

  const startEdit = (item: AdminClientCaseDto) => {
    setEditingCaseId(item.id);
    setEditingValues(createEditableCase(item));
  };

  const cancelEdit = () => {
    setEditingCaseId(null);
    setEditingValues({
      title: '',
      description: '',
      status: 'new',
      currentStage: '',
    });
  };

  const handleCreate = async () => {
    const title = draft.title?.trim();

    if (!title) {
      toast.error('Вкажіть назву справи');
      return;
    }

    setIsSubmittingCreate(true);

    try {
      const created = await apiFetch<AdminClientCaseDto>(
        apiUrl(`/api/admin/clients/${clientId}/cases`),
        {
          method: 'POST',
          body: JSON.stringify({
            title,
            description: draft.description?.trim() ?? '',
            status: draft.status ?? 'new',
            currentStage: draft.currentStage?.trim() || 'Первинний аналіз',
          }),
        }
      );

      setCases(prev => [created, ...prev]);
      resetDraft();
      setIsCreating(false);
      toast.success('Справу створено');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Помилка створення справи'
      );
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleSave = async (caseId: string) => {
    const title = editingValues.title.trim();

    if (!title) {
      toast.error('Назва справи обов’язкова');
      return;
    }

    setSavingCaseId(caseId);

    try {
      const updated = await apiFetch<AdminClientCaseDto>(
        apiUrl(`/api/admin/cases/${caseId}`),
        {
          method: 'PATCH',
          body: JSON.stringify({
            title,
            description: editingValues.description.trim(),
            status: editingValues.status,
            currentStage: editingValues.currentStage.trim(),
          }),
        }
      );

      setCases(prev => prev.map(item => (item.id === caseId ? updated : item)));
      setEditingCaseId(null);
      toast.success('Справу оновлено');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Помилка оновлення справи'
      );
    } finally {
      setSavingCaseId(null);
    }
  };

  const handleDelete = async (caseId: string) => {
    const confirmed = window.confirm('Видалити цю справу?');

    if (!confirmed) return;

    setDeletingCaseId(caseId);

    try {
      await apiFetch<{ id: string }>(apiUrl(`/api/admin/cases/${caseId}`), {
        method: 'DELETE',
      });

      setCases(prev => prev.filter(item => item.id !== caseId));
      if (editingCaseId === caseId) {
        cancelEdit();
      }
      toast.success('Справу видалено');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Помилка видалення справи'
      );
    } finally {
      setDeletingCaseId(null);
    }
  };

  return (
    <section className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-primary text-xl font-semibold">Справи клієнта</h2>
          <p className="text-secondary mt-1 text-sm leading-6">
            Тут можна додавати, редагувати та видаляти справи конкретного
            клієнта.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(prev => !prev)}
          className="bg-accent inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white transition hover:opacity-90"
        >
          {isCreating ? 'Скасувати' : 'Додати справу'}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="border-border bg-background/60 rounded-2xl border p-4">
          <div className="text-secondary text-xs tracking-[0.14em] uppercase">
            Усього справ
          </div>
          <div className="text-primary mt-2 text-2xl font-semibold">
            {summary.total}
          </div>
        </div>

        <div className="border-border bg-background/60 rounded-2xl border p-4">
          <div className="text-secondary text-xs tracking-[0.14em] uppercase">
            Активні
          </div>
          <div className="text-primary mt-2 text-2xl font-semibold">
            {summary.active}
          </div>
        </div>

        <div className="border-border bg-background/60 rounded-2xl border p-4">
          <div className="text-secondary text-xs tracking-[0.14em] uppercase">
            Завершені
          </div>
          <div className="text-primary mt-2 text-2xl font-semibold">
            {summary.completed}
          </div>
        </div>
      </div>

      {isCreating ? (
        <div className="border-border bg-background/60 mt-6 rounded-3xl border p-5">
          <h3 className="text-primary text-lg font-semibold">Нова справа</h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-secondary text-sm font-medium">
                Назва справи
              </span>
              <input
                value={draft.title ?? ''}
                onChange={event =>
                  setDraft(prev => ({ ...prev, title: event.target.value }))
                }
                className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-secondary text-sm font-medium">Статус</span>
              <select
                value={draft.status ?? 'new'}
                onChange={event =>
                  setDraft(prev => ({
                    ...prev,
                    status: event.target.value as CaseStatus,
                  }))
                }
                className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm outline-none"
              >
                {CASE_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-secondary text-sm font-medium">
                Поточний етап
              </span>
              <input
                value={draft.currentStage ?? ''}
                onChange={event =>
                  setDraft(prev => ({
                    ...prev,
                    currentStage: event.target.value,
                  }))
                }
                className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-secondary text-sm font-medium">Опис</span>
              <textarea
                rows={4}
                value={draft.description ?? ''}
                onChange={event =>
                  setDraft(prev => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                className="border-border bg-background text-primary focus:border-accent min-h-28 rounded-2xl border px-4 py-3 text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetDraft();
                setIsCreating(false);
              }}
              className="border-border bg-background text-primary hover:bg-muted inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition"
            >
              Скасувати
            </button>

            <button
              type="button"
              disabled={isSubmittingCreate}
              onClick={handleCreate}
              className="bg-accent inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
            >
              Створити справу
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {cases.length === 0 ? (
          <div className="border-border bg-background/60 rounded-3xl border p-6">
            <div className="text-primary text-base font-medium">
              У клієнта ще немає справ
            </div>
            <p className="text-secondary mt-2 text-sm leading-6">
              Додайте першу справу, щоб почати супровід.
            </p>
          </div>
        ) : (
          cases.map(item => {
            const isEditingCurrent = editingCaseId === item.id;
            const isSavingCurrent = savingCaseId === item.id;
            const isDeletingCurrent = deletingCaseId === item.id;

            return (
              <article
                key={item.id}
                className="border-border bg-background/60 rounded-3xl border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-primary text-lg font-semibold">
                        {item.title}
                      </h3>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          statusBadgeClassMap[item.status]
                        }`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <p className="text-secondary mt-2 text-sm leading-6">
                      {item.description || 'Опис відсутній'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isEditingCurrent ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSave(item.id)}
                          disabled={isSavingCurrent}
                          className="bg-accent inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
                        >
                          Зберегти
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="border-border bg-background text-primary hover:bg-muted inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-medium transition"
                        >
                          Скасувати
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="border-border bg-background text-primary hover:bg-muted inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-medium transition"
                      >
                        Редагувати
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeletingCurrent}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-70"
                    >
                      Видалити
                    </button>
                  </div>
                </div>

                {isEditingCurrent ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-secondary text-sm font-medium">
                        Назва справи
                      </span>
                      <input
                        value={editingValues.title}
                        onChange={event =>
                          setEditingValues(prev => ({
                            ...prev,
                            title: event.target.value,
                          }))
                        }
                        className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm outline-none"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-secondary text-sm font-medium">
                        Статус
                      </span>
                      <select
                        value={editingValues.status}
                        onChange={event =>
                          setEditingValues(prev => ({
                            ...prev,
                            status: event.target.value as CaseStatus,
                          }))
                        }
                        className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm outline-none"
                      >
                        {CASE_STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-secondary text-sm font-medium">
                        Поточний етап
                      </span>
                      <input
                        value={editingValues.currentStage}
                        onChange={event =>
                          setEditingValues(prev => ({
                            ...prev,
                            currentStage: event.target.value,
                          }))
                        }
                        className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm outline-none"
                      />
                    </label>

                    <label className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-secondary text-sm font-medium">
                        Опис
                      </span>
                      <textarea
                        rows={4}
                        value={editingValues.description}
                        onChange={event =>
                          setEditingValues(prev => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                        className="border-border bg-background text-primary focus:border-accent min-h-28 rounded-2xl border px-4 py-3 text-sm outline-none"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div className="border-border bg-card rounded-2xl border p-4">
                      <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                        Поточний етап
                      </div>
                      <div className="text-primary mt-2 text-sm font-medium">
                        {item.currentStage || 'Не вказано'}
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
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
