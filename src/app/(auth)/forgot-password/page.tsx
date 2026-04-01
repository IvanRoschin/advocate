import { ForgotPasswordForm } from '@/app/components';

import AuthCard from '../_components/AuthCard';
import AuthStatusBadge from '../_components/AuthStatusBadge';

const forgotPasswordPage = () => {
  return (
    <AuthCard
      title="Відновлення доступу"
      description="Вкажіть email, і ми надішлемо інструкції для скидання пароля."
    >
      <div className="mb-4">
        <AuthStatusBadge label="Крок безпеки" />
      </div>
      <ForgotPasswordForm />
    </AuthCard>
  );
};

export default forgotPasswordPage;
