import 'server-only';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';
import { UnauthorizedError } from '@/app/lib/server/errors/httpErrors';
import { UserRole } from '@/app/types';

/**
 * Throws UnauthorizedError unless the current session belongs to an
 * ADMIN or MANAGER. Use at the top of every admin-only server action /
 * route handler — this is the data-mutation-layer half of admin
 * protection; src/proxy.ts covers the HTTP-path half.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role !== UserRole.ADMIN && role !== UserRole.MANAGER) {
    throw new UnauthorizedError('Потрібні права адміністратора');
  }

  return session;
}
