import { userService } from '@/app/lib/services/user.service';
import { UserResponseDTO } from '@/app/types';

import UsersClient from './UsersClient';

const UsersPage = async () => {
  const users: UserResponseDTO[] = await userService.getAll();

  return <UsersClient initialUsers={users} />;
};

export default UsersPage;
