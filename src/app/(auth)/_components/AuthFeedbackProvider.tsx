'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Modal, ModalNotification } from '@/components';

type AuthFeedbackPayload = {
  title?: string;
  message: string;
  redirectTo?: string;
  onConfirm?: () => void;
  tone?: 'success' | 'error' | 'info';
};

type AuthFeedbackContextValue = {
  openAuthNotification: (payload: AuthFeedbackPayload) => void;
  closeAuthNotification: () => void;
};

const AuthFeedbackContext = createContext<AuthFeedbackContextValue | null>(
  null
);

export function useAuthFeedback() {
  const context = useContext(AuthFeedbackContext);

  if (!context) {
    throw new Error('useAuthFeedback must be used within AuthFeedbackProvider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export default function AuthFeedbackProvider({ children }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Повідомлення');
  const [message, setMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);
  const [confirmHandler, setConfirmHandler] = useState<
    (() => void) | undefined
  >(undefined);

  const closeAuthNotification = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openAuthNotification = useCallback((payload: AuthFeedbackPayload) => {
    setTitle(payload.title ?? 'Повідомлення');
    setMessage(payload.message);
    setRedirectTo(payload.redirectTo);
    setConfirmHandler(() => payload.onConfirm);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);

    if (confirmHandler) {
      confirmHandler();
      return;
    }

    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [confirmHandler, redirectTo, router]);

  const value = useMemo(
    () => ({
      openAuthNotification,
      closeAuthNotification,
    }),
    [openAuthNotification, closeAuthNotification]
  );

  return (
    <AuthFeedbackContext.Provider value={value}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={closeAuthNotification}
        body={
          <ModalNotification
            title={title}
            message={message}
            onConfirm={handleConfirm}
          />
        }
      />
    </AuthFeedbackContext.Provider>
  );
}
