export type StatusConfig = {
  label: string;
  className: string;
};

/* ---------- COMMON COLORS ---------- */

export const STATUS_STYLES = {
  success:
    'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300',

  warning:
    'rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',

  danger:
    'rounded-full bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-500/15 dark:text-red-300',

  neutral:
    'rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300',
};

/* ---------- ARTICLE ---------- */

export const articleStatusMap: Record<string, StatusConfig> = {
  published: {
    label: 'Опубліковано',
    className: STATUS_STYLES.success,
  },
  draft: {
    label: 'Чернетка',
    className: STATUS_STYLES.warning,
  },
};

/* ---------- LEAD ---------- */

export const leadStatusMap: Record<string, StatusConfig> = {
  processed: {
    label: 'Опрацьований',
    className: STATUS_STYLES.success,
  },
  new: {
    label: 'Неопрацьованый',
    className: STATUS_STYLES.warning,
  },
};

/* ---------- CLIENT ---------- */

export const clientStatusMap = (isActive: boolean): StatusConfig =>
  isActive
    ? {
        label: 'Активний',
        className: STATUS_STYLES.success,
      }
    : {
        label: 'Неактивний',
        className: STATUS_STYLES.danger,
      };

/* ---------- REVIEW ---------- */

export const reviewStatusMap: Record<string, StatusConfig> = {
  processed: {
    label: 'Опрацьований',
    className: STATUS_STYLES.success,
  },
  new: {
    label: 'Новий',
    className: STATUS_STYLES.warning,
  },
};

/* ---------- USER ---------- */

export const userStatusMap = (isActive: boolean): StatusConfig =>
  isActive
    ? {
        label: 'Активний',
        className: STATUS_STYLES.success,
      }
    : {
        label: 'Заблокований',
        className: STATUS_STYLES.danger,
      };

/* ---------- SERVICE ---------- */

export const serviceStatusMap: Record<string, StatusConfig> = {
  published: {
    label: 'Активна',
    className: STATUS_STYLES.success,
  },
  draft: {
    label: 'Чернетка',
    className: STATUS_STYLES.warning,
  },
};
