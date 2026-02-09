import { Btn } from '@/components/index';

const DeleteConfirmation = ({
  onConfirm,
  onCancel,
  title,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}) => {
  return (
    <div>
      <div className="w-full rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Ви впевнені?</h3>
        <p className="mb-4">Ви хочете видалити цей {title}?</p>
        <div className="grid grid-cols-2 gap-4">
          <Btn type="button" label="Скасувати" onClick={onCancel} />
          <Btn type="button" label="Підтвердити" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
