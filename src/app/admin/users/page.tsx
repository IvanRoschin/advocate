import { userActions } from '@/app/actions/user.actions';
import { UserResponseDTO } from '@/app/types';

import UsersClient from './UsersClient';

const UsersPage = async () => {
  const usersRow = await userActions.getAll();

  const users: UserResponseDTO[] = usersRow.items;

  return <UsersClient initialUsers={users} />;
};

export default UsersPage;
