'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';

import { useAuthFeedback } from '@/app/(auth)/_components/AuthFeedbackProvider';
import { requestPasswordReset } from '@/app/actions/auth.actions';
import { HoneypotField } from '@/app/components/forms/shared/HoneypotField';
import { usePublicCaptcha } from '@/app/components/forms/shared/usePublicCaptcha';
import { Btn, Input } from '@/components';

interface InitialStateType {
  email: string;
  website: string;
}

type ForgotPasswordResponse = {
  ok: boolean;
  message: string;
};

const ForgotPasswordForm = () => {
  const { openAuthNotification } = useAuthFeedback();
  const shouldReduceMotion = useReducedMotion();
  const captcha = usePublicCaptcha();

  const initialValues: InitialStateType = { email: '', website: '' };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (!captcha.isConfigured) {
      toast.error('Cloudflare Turnstile не налаштований');
      return;
    }

    if (!captcha.token) {
      toast.error('Будь ласка, підтвердіть, що ви не робот');
      return;
    }

    try {
      const res: ForgotPasswordResponse = await requestPasswordReset({
        email: values.email,
        website: values.website,
        turnstileToken: captcha.token,
      });

      if (res.ok) {
        resetForm();
        captcha.reset();
      }

      openAuthNotification({ title: 'Повідомлення', message: res.message });
    } catch (error) {
      console.error('[FORGOT_PASSWORD_FORM_ERROR]', error);
      openAuthNotification({
        title: 'Помилка',
        message: 'Сталася помилка. Спробуйте ще раз пізніше.',
      });
      captcha.reset();
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            <Input label="Email" type="email" name="email" required />

            <HoneypotField />

            {captcha.isConfigured && (
              <div className="flex justify-center">{captcha.widget}</div>
            )}

            <div className="flex justify-center">
              <Btn
                type="submit"
                label={isSubmitting ? 'Завантаження...' : 'Надіслати посилання'}
                disabled={isSubmitting || !captcha.token}
                className="min-w-30 px-5 py-2 text-base md:min-w-37.5"
              />
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ForgotPasswordForm;
