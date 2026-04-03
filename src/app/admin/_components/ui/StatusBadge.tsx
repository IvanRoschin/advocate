import { STATUS_STYLES, StatusConfig } from './statusMaps';

type Props = {
  status?: string;
  map?: Record<string, StatusConfig>;
  config?: StatusConfig;
};

export function StatusBadge({ status, map, config }: Props) {
  let final: StatusConfig | undefined;

  if (config) {
    final = config;
  } else if (status && map) {
    final = map[status];
  }

  if (!final) {
    return <span className={STATUS_STYLES.neutral}>{status || '—'}</span>;
  }

  return <span className={final.className}>{final.label}</span>;
}
