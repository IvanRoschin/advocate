import { RestorePasswordForm } from '@/app/components';
import { tokenService } from '@/app/lib/services/token.service';
import { TokenType } from '@/app/types';

import AuthCard from '../_components/AuthCard';
import AuthStatusBadge from '../_components/AuthStatusBadge';

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function RestorePasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token;

  let isValid = false;
  let errorMessage = '';

  if (!token) {
    errorMessage = 'Посилання недійсне або відсутній токен.';
  } else {
    try {
      await tokenService.verify(token, TokenType.RESET_PASSWORD);
      isValid = true;
    } catch {
      errorMessage =
        'Термін дії посилання закінчився або посилання вже використане.';
    }
  }

  return (
    <AuthCard
      title="Створіть новий пароль"
      description="Оновіть пароль для безпечного входу до вашого акаунта."
    >
      <div className="mb-4">
        <AuthStatusBadge label="Новий пароль" tone="neutral" />
      </div>

      {isValid ? (
        <RestorePasswordForm token={token!} />
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            {errorMessage}
          </p>

          <a
            href="/forgot-password"
            className="bg-accent text-accent-foreground inline-block rounded-xl px-5 py-3 font-medium transition hover:opacity-90"
          >
            Запросити нове посилання
          </a>
        </div>
      )}
    </AuthCard>
  );
}
