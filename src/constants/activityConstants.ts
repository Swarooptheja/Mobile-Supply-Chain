export const ACTIVITY_CONSTANTS = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 2000,
  API_TIMEOUT_MS: 30000,
  SCROLL_OFFSET: 120,
  SCROLL_DELAY: 300,
} as const;

export const STATUS_COLORS = {
  success: '#4CAF50',
  error: '#FF9800',
  failure: '#FF9800',
  processing: '#2196F3',
  pending: '#FF9800',
  default: '#9E9E9E',
} as const;

export const TYPE_COLORS = {
  master: '#2196F3',
  config: '#00BCD4',
  transactional: '#FF9800',
  default: '#9E9E9E',
} as const;

export const STATUS_ICONS = {
  success: { name: 'check-circle', iconSet: 'MaterialIcons' as const },
  error: { name: 'warning', iconSet: 'MaterialIcons' as const },
  failure: { name: 'warning', iconSet: 'MaterialIcons' as const },
  processing: { name: 'sync', iconSet: 'MaterialIcons' as const },
  pending: { name: 'schedule', iconSet: 'MaterialIcons' as const },
  default: { name: 'help', iconSet: 'MaterialIcons' as const },
} as const;

export const TYPE_ICONS = {
  master: { name: 'database', iconSet: 'Feather' as const },
  config: { name: 'settings', iconSet: 'MaterialIcons' as const },
  transactional: { name: 'flash-on', iconSet: 'MaterialIcons' as const },
  default: { name: 'list', iconSet: 'MaterialIcons' as const },
} as const;

export const TYPE_DISPLAY_NAMES = {
  master: 'MASTER DATA',
  config: 'CONFIGURATION',
  transactional: 'TRANSACTIONAL',
  default: 'OTHER',
} as const;
