export enum TableNames {
  LOGIN = 'login',
  USER_PROFILE = 'user_profile',
  RESPONSIBILITIES = 'responsibilities',
  ORGANIZATIONS = 'organizations',
  SETTINGS = 'settings',
  SHIPPING_TABLE = 'shipping_table',
}

export const TABLE_SCHEMAS = {
  [TableNames.LOGIN]: {
    name: TableNames.LOGIN,
    description: 'Login response data from API',
  },
  [TableNames.USER_PROFILE]: {
    name: TableNames.USER_PROFILE,
    description: 'User profile information',
  },
  [TableNames.RESPONSIBILITIES]: {
    name: TableNames.RESPONSIBILITIES,
    description: 'User responsibilities data',
  },
  [TableNames.ORGANIZATIONS]: {
    name: TableNames.ORGANIZATIONS,
    description: 'Organization data',
  },
  [TableNames.SETTINGS]: {
    name: TableNames.SETTINGS,
    description: 'Application settings',
  },
  [TableNames.SHIPPING_TABLE]: {
    name: TableNames.SHIPPING_TABLE,
    description: 'Sales orders for shipping table data',
  },
} as const;
