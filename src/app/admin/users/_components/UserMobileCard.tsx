import type { UserResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

type UserMobileCardProps = {
  row: UserResponseDTO;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
};

function getUserStatusBadge(isActive: boolean) {
  return isActive
    ? {
        label: 'Активний',
        className:
          'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300',
      }
    : {
        label: 'Заблокований',
        className:
          'rounded-full bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-500/15 dark:text-red-300',
      };
}

function getUserRoleLabel(role: UserResponseDTO['role']) {
  switch (role) {
    case 'admin':
      return 'Адміністратор';
    case 'manager':
      return 'Менеджер';
    default:
      return role;
  }
}

export function UserMobileCard({ row, onEdit, onDelete }: UserMobileCardProps) {
  const badge = getUserStatusBadge(row.isActive);

  return (
    <AdminTableCard
      title={row.name || 'Без імені'}
      subtitle={row.email}
      badge={<span className={badge.className}>{badge.label}</span>}
      footer={
        <div className="flex flex-wrap justify-between">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="bg-foreground text-background inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-90"
          >
            Відкрити
          </button>

          <button
            type="button"
            onClick={() => onDelete(row)}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Видалити
          </button>
        </div>
      }
    >
      <AdminCardField label="Ім’я" value={row.name} />
      <AdminCardField label="Email" value={row.email} />
      <AdminCardField label="Телефон" value={row.phone || '—'} />
      <AdminCardField label="Роль" value={getUserRoleLabel(row.role)} />
    </AdminTableCard>
  );
}
