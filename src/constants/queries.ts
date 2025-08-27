import { TableNames } from "./tables";

export const LOGIN_QUERIES = {
    GET_DEFAULT_ORG_ID: `SELECT DEFAULT_ORG_ID FROM ${TableNames.LOGIN} WHERE DEFAULT_ORG_ID IS NOT NULL AND DEFAULT_ORG_ID != '' LIMIT 1`,
}

export const ORGANIZATION_QUERIES = {
    GET_ALL: `SELECT * FROM ${TableNames.ORGANIZATIONS}`,
    GET_PAGED: `SELECT * FROM ${TableNames.ORGANIZATIONS} ORDER BY InventoryOrgName ASC LIMIT ? OFFSET ?`,
    SEARCH_PAGED: `SELECT * FROM ${TableNames.ORGANIZATIONS} \
WHERE InventoryOrgName LIKE ? OR InventoryOrgCode LIKE ? OR BusinessUnitName LIKE ? \
ORDER BY InventoryOrgName ASC LIMIT ? OFFSET ?`,
};