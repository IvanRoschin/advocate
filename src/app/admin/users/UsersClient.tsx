'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import {
  CreateUserRequestDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '@/app/types';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Loader,
  Modal,
  UserForm,
} from '@/components';

import { AdminTable } from '../components/table';
import { userColumns } from './user.columns';

interface Props {
  initialUsers: UserResponseDTO[];
}

export default function UsersClient({ initialUsers }: Props) {
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

      setUsers(prev => prev.filter(user => user._id !== userToDelete._id));

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

    try {
      const updatedUser = await apiFetch<UserResponseDTO>(
        apiUrl(`/api/admin/users/${userToUpdate._id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );

      setUsers(prev =>
        prev.map(user => (user._id === updatedUser._id ? updatedUser : user))
      );

      toast.success('Користувача оновлено');
      updateModal.close();
      setUserToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    }
  };

  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <UserForm onSubmit={handleCreateUser} onClose={createModal.close} />
      }
    />
  );
  /* ---------------- UI ---------------- */

  if (!users) return <Loader />;

  if (users.length === 0) {
    return (
      <div className="container">
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
    <div className="container">
      <Breadcrumbs />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-accent text-xl font-semibold">Користувачі</h1>
        <Btn label="Додати користувача" onClick={createModal.open} />
      </div>

      <AdminTable
        data={users}
        columns={userColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
      />

      {/* Create */}
      {renderCreateModal}

      {/* Delete */}
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

      {/* Update */}
      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => {
          updateModal.close();
          setUserToUpdate(null);
        }}
        body={
          userToUpdate && (
            <UserForm
              initialValues={{
                name: userToUpdate.name,
                email: userToUpdate.email,
                password: '',
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
    </div>
  );
}
