'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { CategoryForm } from '@/app/components/forms';
import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store.ts';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Loader,
  Modal,
} from '@/components';

import { AdminPageContainer } from '../_components/AdminPageContainer';
import { AdminTable } from '../_components/table';
import { AdminTableToolbar } from '../_components/table/AdminTableToolbar';
import { CategoryMobileCard } from './_components/CategoryMobileCard';
import { categoryColumns } from './category.columns';

import type {
  CategoryResponseDTO,
  CreateCategoryRequestDTO,
  UpdateCategoryDTO,
} from '@/app/types';
interface Props {
  initialCategories: CategoryResponseDTO[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

  const [categories, setCategories] =
    useState<CategoryResponseDTO[]>(initialCategories);

  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryResponseDTO | null>(null);

  const [categoryToUpdate, setCategoryToUpdate] =
    useState<CategoryResponseDTO | null>(null);

  const createModal = useModal('createCategory');
  const deleteModal = useModal('deleteCategory');
  const updateModal = useModal('updateCategory');

  const handleDelete = (category: CategoryResponseDTO) => {
    setCategoryToDelete(category);
    deleteModal.open();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    start();
    try {
      await apiFetch<void>(
        apiUrl(`/api/admin/categories/${categoryToDelete._id}`),
        { method: 'DELETE' }
      );

      setCategories(prev =>
        prev.filter(category => category._id !== categoryToDelete._id)
      );

      toast.success('Категорію видалено');
      deleteModal.close();
      setCategoryToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  };

  const handleEdit = (category: CategoryResponseDTO) => {
    setCategoryToUpdate(category);
    updateModal.open();
  };

  const handleCreateCategory = async (payload: CreateCategoryRequestDTO) => {
    start();
    try {
      const newCategory = await apiFetch<CategoryResponseDTO>(
        apiUrl('/api/admin/categories'),
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setCategories(prev => [newCategory, ...prev]);
      toast.success('Категорію створено');
      createModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    } finally {
      done();
    }
  };

  const handleUpdateCategory = async (payload: UpdateCategoryDTO) => {
    if (!categoryToUpdate) return;

    start();
    try {
      const updatedCategory = await apiFetch<CategoryResponseDTO>(
        apiUrl(`/api/admin/categories/${categoryToUpdate._id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );

      setCategories(prev =>
        prev.map(category =>
          category._id === updatedCategory._id ? updatedCategory : category
        )
      );

      toast.success('Категорію оновлено');
      updateModal.close();
      setCategoryToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    } finally {
      done();
    }
  };

  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <CategoryForm
          onSubmit={handleCreateCategory}
          onClose={createModal.close}
        />
      }
    />
  );

  const renderDeleteModal = (
    <Modal
      isOpen={deleteModal.isOpen}
      onClose={deleteModal.close}
      body={
        <DeleteConfirmation
          title={`Категорія: ${categoryToDelete?.title ?? '—'}`}
          onConfirm={handleDeleteConfirm}
          onCancel={deleteModal.close}
        />
      }
    />
  );

  const renderUpdateModal = (
    <Modal
      isOpen={updateModal.isOpen}
      onClose={() => {
        updateModal.close();
        setCategoryToUpdate(null);
      }}
      body={
        categoryToUpdate && (
          <CategoryForm
            initialValues={{
              title: categoryToUpdate.title,
              src: categoryToUpdate.src,
              slug: categoryToUpdate.slug,
            }}
            submitLabel="Оновити категорію"
            onSubmit={handleUpdateCategory}
            onClose={() => {
              updateModal.close();
              setCategoryToUpdate(null);
            }}
          />
        )
      }
    />
  );

  if (!categories) return <Loader />;

  if (categories.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Категорії відсутні"
          subtitle="Додайте першу категорію"
          actionLabel="Додати нову категорію"
          actionOnClick={createModal.open}
        />
        {renderCreateModal}
        {renderDeleteModal}
        {renderUpdateModal}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
      <Breadcrumbs />

      <AdminPageContainer
        title="Категорії"
        description="Керуйте категоріями контенту"
        actions={<Btn label="Додати категорію" onClick={createModal.open} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={categories}
          columns={categoryColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          isLoading={isLoading}
          emptyMessage="Категорій поки немає"
          mobileRender={category => (
            <CategoryMobileCard
              row={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      </AdminPageContainer>

      {renderCreateModal}
      {renderDeleteModal}
      {renderUpdateModal}
    </div>
  );
}
