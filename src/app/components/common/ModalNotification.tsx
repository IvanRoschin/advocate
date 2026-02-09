import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

import { Btn } from '@/components';

interface ModalNotificationProps {
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ModalNotification = ({
  title = 'Увага',
  message,
  onConfirm,
  onCancel,
}: ModalNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex w-full flex-col items-center text-center"
    >
      <div className="mb-3 flex items-center justify-center">
        <FiAlertCircle className="text-primaryAccentColor mr-3 h-8 w-8" />
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>

      <p className="mb-6 px-2 leading-relaxed text-gray-700">{message}</p>

      <div className="mt-2 flex justify-center gap-4">
        {onCancel && <Btn type="button" label="Скасувати" onClick={onCancel} />}

        {onConfirm && <Btn type="button" label="OK" onClick={onConfirm} />}
      </div>
    </motion.div>
  );
};

export default ModalNotification;
