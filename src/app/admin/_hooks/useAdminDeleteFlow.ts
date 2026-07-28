'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store';

type UseAdminDeleteFlowOptions<T> = {
  /** Unique key for the confirm-delete modal (e.g. 'deleteService'). */
  modalKey: string;
  /** Base admin API path for the entity (e.g. routes.api.admin.services). */
  apiPath: string;
  getId: (item: T) => string;
  successMessage: string;
  /** Called after a successful delete so the caller can update its own list state. */
  onDeleted: (item: T) => void;
  errorMessage?: string;
};

/**
 * Shared "click delete → confirm in modal → DELETE request → toast" flow
 * that was hand-duplicated (near-identically) across every admin list page.
 * Callers stay in charge of their own list state via `onDeleted`.
 */
export function useAdminDeleteFlow<T>({
  modalKey,
  apiPath,
  getId,
  successMessage,
  onDeleted,
  errorMessage = 'Помилка видалення',
}: UseAdminDeleteFlowOptions<T>) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const deleteModal = useModal(modalKey);

  const handleDelete = useCallback(
    (item: T) => {
      setItemToDelete(item);
      deleteModal.open();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;

    start();
    try {
      await apiFetch<void>(apiUrl(`${apiPath}/${getId(itemToDelete)}`), {
        method: 'DELETE',
      });

      onDeleted(itemToDelete);
      toast.success(successMessage);
      deleteModal.close();
      setItemToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : errorMessage);
    } finally {
      done();
    }
  }, [
    itemToDelete,
    apiPath,
    getId,
    onDeleted,
    successMessage,
    errorMessage,
    start,
    done,
    deleteModal,
  ]);

  return {
    itemToDelete,
    deleteModal,
    handleDelete,
    handleDeleteConfirm,
  };
}
