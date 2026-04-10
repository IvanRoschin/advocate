import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { routes } from '@/app/config/routes';
import { ensureClientAccess } from '@/app/lib/auth/ensureClientAccess';
import { getAccountState } from '@/app/lib/auth/getAccountState';
import { authOptions } from '@/config';

export default async function RepairClientAccessPage() {
  const session = await getServerSession(authOptions);
  const accountState = getAccountState(session);

  if (accountState === 'guest') {
    redirect(routes.public.auth.signIn);
  }

  if (accountState === 'inactive') {
    redirect(routes.public.auth.verifyEmail);
  }

  if (accountState === 'admin_ready') {
    redirect(routes.admin.dashboard);
  }

  if (accountState === 'client_ready') {
    redirect(routes.client.dashboard);
  }

  const userId = session?.user?.id;

  if (!userId) {
    redirect(routes.public.auth.signIn);
  }

  const repairResult = await ensureClientAccess(userId);

  if (repairResult.ok) {
    redirect(routes.client.dashboard);
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">
          Доступ до кабінету клієнта ще не налаштовано
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Ви успішно увійшли в акаунт, але ми не змогли автоматично відновити
          доступ до профілю клієнта.
        </p>

        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p>
            Код стану: <strong>{repairResult.code}</strong>
          </p>
          <p className="mt-2">
            Перевірте, чи збігаються e-mail або телефон користувача з даними
            клієнта, або зверніться до адміністратора.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={routes.public.home}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            На головну
          </Link>

          <Link
            href={routes.public.auth.signIn}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            До входу
          </Link>
        </div>
      </div>
    </div>
  );
}
