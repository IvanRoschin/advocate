import type { UserResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { userStatusMap } from '../../_components/ui/statusMaps';

type UserMobileCardProps = {
  row: UserResponseDTO;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
};

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
  return (
    <AdminTableCard
      title={row.name || 'Без імені'}
      subtitle={row.email}
      badge={<StatusBadge config={userStatusMap(row.isActive)} />}
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
    >
      <AdminCardField label="Ім’я" value={row.name} />
      <AdminCardField label="Email" value={row.email} />
      <AdminCardField label="Телефон" value={row.phone || '—'} />
      <AdminCardField label="Роль" value={getUserRoleLabel(row.role)} />
    </AdminTableCard>
  );
}
