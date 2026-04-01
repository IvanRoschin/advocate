'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';

import { routes } from '@/app/config/routes';
import { Btn, Input } from '@/components';
import { UserRole } from '@/types';

interface InitialStateType {
  phone: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues: InitialStateType = {
    phone: '+380',
    password: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const callback = await signIn('credentials', {
        phone: values.phone.trim(),
        password: values.password,
        redirect: false,
      });

      if (!callback?.ok) {
        toast.error(callback?.error || 'Помилка входу');
        return;
      }

      toast.success('Успішний вхід');
      resetForm();

      const session = await getSession();
      const role = session?.user?.role as UserRole | undefined;

      if (role === UserRole.ADMIN) {
        router.replace('/admin');
      } else {
        router.replace('/client');
      }

      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Не вдалося виконати вхід');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await signIn('google', {
        callbackUrl: '/auth/redirect',
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Не вдалося розпочати вхід через Google');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="flex flex-col gap-5">
            <Input name="phone" label="Телефон" type="tel" required />

            <div className="relative">
              <Input
                name="password"
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-gray-500"
                aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <div className="flex justify-center">
              <motion.div
                className="inline-block"
                whileHover={{
                  scale: isLoading ? 1 : 1.02,
                }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Btn
                  type="submit"
                  label={isLoading ? 'Завантаження...' : 'Увійти'}
                  disabled={isLoading}
                />
              </motion.div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="my-8 flex items-center">
        <hr className="grow border-gray-300" />
        <span className="px-3 text-sm text-gray-500">або</span>
        <hr className="grow border-gray-300" />
      </div>

      <div className="flex justify-center">
        <motion.div
          whileHover={{
            scale: isLoading ? 1 : 1.02,
          }}
          whileTap={{ scale: isLoading ? 1 : 0.97 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Btn
            type="button"
            uiVariant="outline"
            label="Continue with Google"
            icon={FcGoogle}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          />
        </motion.div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Забули пароль?{' '}
        <Link
          href={routes.public.auth.forgotPassword}
          className="nav font-medium hover:text-gray-500"
        >
          Відновити
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
