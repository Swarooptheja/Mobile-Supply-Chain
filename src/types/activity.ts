export type IActivityStatus = 'pending' | 'processing' | 'success' | 'error' | 'failure' | 'blocked';
export type IApiType = 'master' | 'config' | 'transactional';

export interface IActivity {
  id: string;
  name: string;
  type: IApiType;
  url: string;
  status: IActivityStatus;
  progress: number;
  recordsTotal: number;
  recordsInserted: number;
  error: string | null;
  startTime: Date | null;
  endTime: Date | null;
  canExpand: boolean;
  orgId?: string;
  defaultOrgId?: string | null;
  retryCount: number;
  lastRetryTime?: Date;
  apiName: string;
}

export interface IApiResult {
  success: boolean;
  recordsTotal: number;
  recordsInserted: number;
  error: string | null;
}

export interface IActivityProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface IActivityBatchResult {
  successful: IActivity[];
  failed: IActivity[];
  blocked: IActivity[];
}
