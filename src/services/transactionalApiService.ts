import { API_ENDPOINTS } from '../config/api';
import { LOAD_TO_DOCK_QUERIES } from '../constants/queries';

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

export const TRANSACTIONAL_APIS: Record<string, Omit<IApiConfig, 'responsibility'>> = {
  SHIP_CONFIRM: {
    url: API_ENDPOINTS.SALES_ORDERS_SHIPPING,
    type: 'transactional',
    requiresOrgId: true,
    requiresDefaultOrgId: false,
    tableType: 'table',
    version: 'EBS/23B',
    lastSyncTime: true,
    fullRefresh: false,
    queries: [LOAD_TO_DOCK_QUERIES.CREATE_LOAD_TO_DOCK_TRANSACTION_TABLE],
    apiName: 'Shipping Orders'
  },
};

export class TransactionalApiService {
  static getTransactionalApis(): Record<string, Omit<IApiConfig, 'responsibility'>> {
    return TRANSACTIONAL_APIS;
  }

  static getTransactionalApi(key: string): Omit<IApiConfig, 'responsibility'> | undefined {
    return TRANSACTIONAL_APIS[key];
  }

  static getTransactionalApiKeys(): string[] {
    return Object.keys(TRANSACTIONAL_APIS);
  }

  static getTransactionalApiNames(): string[] {
    return Object.values(TRANSACTIONAL_APIS).map(api => api.apiName);
  }
}
