'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { CategoryForm } from '@/app/components/forms/index';
import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import {
  CategoryResponseDTO,
  CreateCategoryRequestDTO,
  UpdateCategoryDTO,
} from '@/app/types';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Loader,
  Modal,
} from '@/components/index';

import { categoryColumns } from '../categories/category.columns';
import { AdminTable } from '../components/table';

interface Props {
  initialCategories: CategoryResponseDTO[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const [categories, setCategories] =
    useState<CategoryResponseDTO[]>(initialCategories);

  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryResponseDTO | null>(null);

  const [categoryToUpdate, setCategoryToUpdate] =
    useState<CategoryResponseDTO | null>(null);

  const createModal = useModal('createCategory');
  const deleteModal = useModal('deleteCategory');
  const updateModal = useModal('updateCategory');

  /* ---------- handlers ---------- */

  const handleDelete = (category: CategoryResponseDTO) => {
    setCategoryToDelete(category);
    deleteModal.open();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await apiFetch<void>(
        apiUrl(`/api/admin/categories/${categoryToDelete._id}`),
        { method: 'DELETE' }
      );

      setCategories(prev =>
        prev.filter(cat => cat._id !== categoryToDelete._id)
      );

      toast.success('Категорію видалено');
      deleteModal.close();
      setCategoryToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const handleEdit = (category: CategoryResponseDTO) => {
    setCategoryToUpdate(category);
    updateModal.open();
  };

  const handleCreateCategory = async (payload: CreateCategoryRequestDTO) => {
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
    }
  };

  const handleUpdateCategory = async (payload: UpdateCategoryDTO) => {
    if (!categoryToUpdate) return;

    try {
      const updatedCategory = await apiFetch<CategoryResponseDTO>(
        apiUrl(`/api/admin/categories/${categoryToUpdate?._id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );
      setCategories(prev =>
        prev.map(cat =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
      toast.success('Категорію оновлено');
      updateModal.close();
      setCategoryToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    }
  };

  /* ---------------- UI ---------------- */

  if (!categories) return <Loader />;

  if (categories.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="Категорії відсутні"
          subtitle="Додайте першу категорію"
          actionLabel="Додати нову категорію"
          actionOnClick={createModal.open}
        />
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
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-accent text-xl font-semibold">Категорії</h1>
        <Btn label="Додати категорію" onClick={createModal.open} />
      </div>

      <AdminTable
        data={categories}
        columns={categoryColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
      />
      {/* Create */}
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

      {/* Delete */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        body={
          <DeleteConfirmation
            title={`Категорія: ${categoryToDelete?.title}`}
            onConfirm={handleDeleteConfirm}
            onCancel={deleteModal.close}
          />
        }
      />

      {/* Update */}
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
              onClose={updateModal.close}
            />
          )
        }
      />
    </div>
  );
}
