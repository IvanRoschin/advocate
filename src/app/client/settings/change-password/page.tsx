import { getServerSession } from 'next-auth';

import { ChangePasswordForm } from '@/app/components/forms/ChangePasswordForm';
import { authOptions } from '@/app/config';

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id) {
    return null;
  }

  return (
    <div>
      <ChangePasswordForm userId={user.id} userEmail={user.email} />
    </div>
  );
}
