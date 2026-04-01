import AuthCard from '../_components/AuthCard';
import AuthStatusBadge from '../_components/AuthStatusBadge';
import VerificationPageClient from './VerificationPageClient';

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Підтвердіть email"
      description="Ми надіслали лист із посиланням для підтвердження облікового запису."
      align="center"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <AuthStatusBadge label="Перевірте пошту" tone="success" />
        </div>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
          Якщо лист не з’явився у вхідних, перевірте папку “Спам” або надішліть
          лист повторно.
        </p>
        <VerificationPageClient />
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-5 py-3 font-medium transition"
          >
            Надіслати повторно
          </button>

          <a
            href="/signin"
            className="border-border hover:bg-foreground/5 rounded-xl border px-5 py-3 font-medium transition"
          >
            Повернутися до входу
          </a>
        </div>
      </div>
    </AuthCard>
  );
}
