'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';

import { routes } from '@/app/config/routes';
import { Btn, Input } from '@/components';
import { UserRole } from '@/types';

interface InitialStateType {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues: InitialStateType = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true);

    const callback = await signIn('credentials', {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    setIsLoading(false);

    if (callback?.ok) {
      toast.success('Успішний вхід');
      resetForm();

      const session = await getSession();

      const role = session?.user?.role as UserRole;

      if (role === UserRole.ADMIN) router.replace('/admin');
      else router.replace('/client');

      router.refresh();
    } else {
      toast.error(callback?.error || 'Помилка входу');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', {
      callbackUrl: '/auth/redirect',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:max-w-lg md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            Сторінка авторизації
          </h2>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            // validationSchema={userLoginSchema}
            enableReinitialize
          >
            {() => (
              <Form className="flex flex-col gap-5">
                {/* Email */}
                <Input name="email" label="Email" type="text" required />
                {/* Password с глазиком 👇 */}
                <div className="relative">
                  <Input
                    name="password"
                    label="Password"
                    type={`${showPassword ? 'text' : 'password'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0px 0px 12px rgba(59,130,246,0.5)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Btn
                    type="submit"
                    label={isLoading ? 'Завантаження...' : 'Увійти'}
                    disabled={isLoading}
                  />
                </motion.div>
              </Form>
            )}
          </Formik>

          <div className="my-8 flex items-center">
            <hr className="grow border-gray-300" />
            <span className="px-3 text-sm text-gray-500">або</span>
            <hr className="grow border-gray-300" />
          </div>

          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0px 0px 12px rgba(234,67,53,0.4)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Btn
              uiVariant="outline"
              label="Continue with Google"
              icon={FcGoogle}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            />
          </motion.div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Забули пароль?{' '}
            <a
              href={routes.public.auth.forgotPassword}
              className="nav font-medium hover:text-gray-500"
            >
              Відновити
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
