import Link from 'next/link';

import RegisterForm from '@/app/components/forms/RegisterForm';
import { routes } from '@/app/config/routes';

import AuthCard from '../_components/AuthCard';
import AuthStatusBadge from '../_components/AuthStatusBadge';
import NoAccountEmailNotice from './_components/NoAccountEmailNotice';

export default function NoAccountPage() {
  return (
    <AuthCard
      title="Кабінет не знайдено"
      description="Заповніть заявку нижче — ми перевіримо дані і надішлемо посилання для активації кабінету."
      align="center"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <AuthStatusBadge label="Кабінет відсутній" tone="neutral" />
        </div>

        <NoAccountEmailNotice />

        <div className="mt-4 w-full">
          <RegisterForm />
        </div>

        <Link
          href={routes.public.auth.signIn}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Повернутися до входу
        </Link>
      </div>
    </AuthCard>
  );
}
