'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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
  UserForm,
} from '@/components';

import { AdminPageContainer } from '../_components/AdminPageContainer';
import { AdminTable } from '../_components/table';
import { AdminTableToolbar } from '../_components/table/AdminTableToolbar';
import { UserMobileCard } from './_components/UserMobileCard';
import { userColumns } from './user.columns';

import type {
  CreateUserRequestDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '@/app/types';

interface Props {
  initialUsers: UserResponseDTO[];
}

export default function UsersClient({ initialUsers }: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

  const [users, setUsers] = useState<UserResponseDTO[]>(initialUsers);
  const [userToDelete, setUserToDelete] = useState<UserResponseDTO | null>(
    null
  );
  const [userToUpdate, setUserToUpdate] = useState<UserResponseDTO | null>(
    null
  );

  const createModal = useModal('createUser');
  const deleteModal = useModal('deleteUser');
  const updateModal = useModal('updateUser');

  /* ---------- handlers ---------- */

  const handleDelete = (user: UserResponseDTO) => {
    setUserToDelete(user);
    deleteModal.open();
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await apiFetch<void>(apiUrl(`/api/admin/users/${userToDelete._id}`), {
        method: 'DELETE',
      });

      setUsers(prev => prev.filter(u => u._id !== userToDelete._id));

      toast.success('Користувача видалено');
      deleteModal.close();
      setUserToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const handleEdit = (user: UserResponseDTO) => {
    setUserToUpdate(user);
    updateModal.open();
  };

  const handleCreateUser = async (payload: CreateUserRequestDTO) => {
    try {
      const newUser = await apiFetch<UserResponseDTO>(
        apiUrl('/api/admin/users'),
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setUsers(prev => [newUser, ...prev]);
      toast.success('Користувача створено');
      createModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    }
  };

  const handleUpdateUser = async (payload: UpdateUserDTO) => {
    if (!userToUpdate) return;

    start();
    try {
      const { password, ...rest } = payload;

      const cleanedRest = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== '' && v !== undefined)
      ) as Omit<UpdateUserDTO, 'password'>;

      const cleanPayload: UpdateUserDTO = {
        ...cleanedRest,
        ...(password?.trim() ? { password: password.trim() } : {}),
      };

      const updatedUser = await apiFetch<UserResponseDTO>(
        apiUrl(`/api/admin/users/${userToUpdate._id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(cleanPayload),
        }
      );

      setUsers(prev =>
        prev.map(u => (u._id === updatedUser._id ? updatedUser : u))
      );

      toast.success('Користувача оновлено');
      updateModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    } finally {
      done();
    }
  };

  /* ---------- modals ---------- */

  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <UserForm
          mode="create"
          onSubmit={handleCreateUser}
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
          title={`Користувач: ${userToDelete?.email}`}
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
        setUserToUpdate(null);
      }}
      body={
        userToUpdate && (
          <UserForm
            mode="edit"
            initialValues={{
              name: userToUpdate.name,
              email: userToUpdate.email,
              password: '',
              phone: userToUpdate.phone,
              role: userToUpdate.role,
              isActive: userToUpdate.isActive,
            }}
            submitLabel="Оновити користувача"
            onSubmit={handleUpdateUser}
            onClose={updateModal.close}
          />
        )
      }
    />
  );

  if (!users) return <Loader />;

  if (users.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Користувачі відсутні 🤷"
          subtitle="Додайте першого користувача"
          actionLabel="Додати нового користувача"
          actionOnClick={createModal.open}
        />
        {renderCreateModal}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
      <Breadcrumbs />

      <AdminPageContainer
        title="Користувачі"
        description="Керуйте доступами та ролями"
        actions={<Btn label="Додати користувача" onClick={createModal.open} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={users}
          columns={userColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          isLoading={isLoading}
          emptyMessage="Користувачів поки немає"
          mobileRender={user => (
            <UserMobileCard
              row={user}
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
