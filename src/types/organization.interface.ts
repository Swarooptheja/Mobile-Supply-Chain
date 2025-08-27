import type { OrganizationRow } from '../services/organizationService';

export type OrganizationListItem = OrganizationRow & {
  InventoryOrgId?: string | number;
  id?: string | number;
  InventoryOrgName?: string;
  InventoryOrgCode?: string;
};


