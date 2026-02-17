import { userService } from '@/app/lib/services/user.service';
import { UserResponseDTO } from '@/app/types';

import UsersClient from './UsersClient';

export const revalidate = 0;

const UsersPage = async () => {
  const users: UserResponseDTO[] = await userService.getAll();

  return <UsersClient initialUsers={users} />;
};

export default UsersPage;
