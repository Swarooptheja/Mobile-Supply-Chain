import { simpleDatabaseService } from './simpleDatabase';
import { ORGANIZATION_QUERIES } from '../constants/queries';
import { getDataFromResultSet } from '../../services/sharedService';

export type OrganizationRow = {
  InventoryOrgId?: string | number;
  id?: string | number;
  InventoryOrgName?: string;
  InventoryOrgCode?: string;
  BusinessUnitName?: string;
  [key: string]: any;
};

export type FetchOrganizationsParams = {
  page: number;
  limit: number;
  search?: string;
};

export type FetchOrganizationsResult = {
  rows: OrganizationRow[];
};

export async function fetchOrganizationsPaged(params: FetchOrganizationsParams): Promise<FetchOrganizationsResult> {
  const { page, limit, search } = params;
  const offset = page * limit;

  let query = ORGANIZATION_QUERIES.GET_PAGED as string;
  let qParams: any[] = [limit, offset];

  if (search && search.trim().length > 0) {
    const like = `%${search.trim()}%`;
    query = ORGANIZATION_QUERIES.SEARCH_PAGED as string;
    qParams = [like, like, like, limit, offset];
  }

  const result = await simpleDatabaseService.executeQuery(query, qParams);
  const rows = getDataFromResultSet(result) as OrganizationRow[];
  
  // Ensure all rows have proper fallback values to prevent null text rendering errors
  const safeRows = rows.map(row => ({
    ...row,
    InventoryOrgId: row.InventoryOrgId ?? row.id ?? '',
    InventoryOrgName: row.InventoryOrgName || 'Unknown Organization',
    InventoryOrgCode: row.InventoryOrgCode || row.InventoryOrgId || row.id || 'N/A',
    BusinessUnitName: row.BusinessUnitName || 'Unknown Business Unit'
  }));
  
  return { rows: safeRows };
}


