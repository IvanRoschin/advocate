import Link from 'next/link';

import RegisterForm from '@/app/components/forms/public/PulicRegisterForm';
import { routes } from '@/app/config/routes';

import AuthCard from '../_components/AuthCard';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Реєстрація"
      description="Залиште контакти — ми перевіримо заявку і надішлемо посилання для активації кабінету."
    >
      <RegisterForm />

      <p className="mt-8 text-center text-sm text-gray-500">
        Вже маєте кабінет?{' '}
        <Link
          href={routes.public.auth.signIn}
          className="nav font-medium hover:text-gray-500"
        >
          Увійти
        </Link>
      </p>
    </AuthCard>
  );
}
