import { API_ENDPOINTS } from '../config/api';

export interface IApiConfig {
  responsibility: string;
  apiName: string;
  url: string;
  type: 'master' | 'config' | 'transactional';
  requiresOrgId: boolean;
  requiresDefaultOrgId: boolean;
  tableType: 'json' | 'table';
  version: string;
  lastSyncTime?: boolean;
  fullRefresh?: boolean;
  queries?: string[];
}

export const MASTER_APIS: Record<string, Omit<IApiConfig, 'responsibility'>> = {
  ITEM: {
    url: API_ENDPOINTS.ITEM,
    type: 'master',
    requiresOrgId: true,
    requiresDefaultOrgId: false,
    tableType: 'table',
    version: 'EBS/20D',
    lastSyncTime: true,
    apiName: 'Items'
  },
  ACCOUNT: {
    url: API_ENDPOINTS.ACCOUNT,
    type: 'master',
    requiresOrgId: false,
    requiresDefaultOrgId: true,
    tableType: 'json',
    version: 'EBS/20D',
    apiName: 'GL Accounts'
  },
  SUB_INV: {
    url: API_ENDPOINTS.SUB_INV,
    type: 'master',
    requiresOrgId: true,
    requiresDefaultOrgId: false,
    tableType: 'json',
    version: 'EBS/20D',
    lastSyncTime: true,
    fullRefresh: true,
    apiName: 'Sub Inventories'
  },
  LOCATORS: {
    url: API_ENDPOINTS.LOCATORS,
    type: 'master',
    requiresOrgId: true,
    requiresDefaultOrgId: false,
    tableType: 'table',
    version: 'EBS/23A',
    lastSyncTime: true,
    apiName: 'Locators'
  },
};

export class MasterApiService {
  static getMasterApis(): Record<string, Omit<IApiConfig, 'responsibility'>> {
    return MASTER_APIS;
  }

  static getMasterApi(key: string): Omit<IApiConfig, 'responsibility'> | undefined {
    return MASTER_APIS[key];
  }

  static getMasterApiKeys(): string[] {
    return Object.keys(MASTER_APIS);
  }

  static getMasterApiNames(): string[] {
    return Object.values(MASTER_APIS).map(api => api.apiName);
  }
}
