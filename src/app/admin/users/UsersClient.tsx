'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import CreateUserForm from '@/app/components/forms/CreateUserForm';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type { CreateUserRequestDTO, UserResponseDTO } from '@/types';

interface Props {
  initialUsers: UserResponseDTO[];
}

export default function UsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserResponseDTO[]>(initialUsers);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateUser = async (formValues: CreateUserRequestDTO) => {
    try {
      const newUser = await apiFetch<UserResponseDTO>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(formValues),
      });

      setUsers(prev => [newUser, ...prev]);
      toast.success('Користувача створено');
      setIsOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Користувачі</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg border px-4 py-2"
        >
          Додати користувача
        </button>
      </div>

      {/* List */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b font-medium">
            <td>Імʼя</td>
            <td>Email</td>
            <td>Роль</td>
            <td>Статус</td>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-b">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Активний' : 'Неактивний'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isOpen && (
        <CreateUserForm
          onSubmit={handleCreateUser}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
