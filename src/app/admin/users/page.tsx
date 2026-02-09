import { apiFetch } from '@/app/lib/client/apiFetch';
import { UserResponseDTO } from '@/app/types';

import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';
const UsersPage = async () => {
  const users = await apiFetch<UserResponseDTO[]>('/api/admin/users');

  return <UsersClient initialUsers={users} />;
};

export default UsersPage;
