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

export const LOAD_TO_DOCK_QUERIES = {
    GET_ALL_ITEMS: `
        SELECT *
        FROM ${TableNames.SHIPPING_TABLE} 
        GROUP BY DeliveryId
        ORDER BY ShipDate DESC
    `,
    
    GET_ITEMS_PAGINATED: `
        SELECT *
        FROM ${TableNames.SHIPPING_TABLE} 
        GROUP BY DeliveryId
        ORDER BY ShipDate DESC
        LIMIT ? OFFSET ?
    `,
    
    GET_ITEMS_BY_DELIVERY_ID: `
        SELECT *
        FROM ${TableNames.SHIPPING_TABLE} 
        WHERE DeliveryId = ?
    `,
    
    SEARCH_ITEMS_BY_ITEM_NUMBER_AND_DESC: `
        SELECT *
        FROM ${TableNames.SHIPPING_TABLE} 
        WHERE DeliveryId = ? 
        AND (ItemNumber LIKE ? OR ItemDesc LIKE ?)
    `,
    
    SCAN_ITEMS_BY_ITEM_NUMBER: `
    SELECT *
    FROM ${TableNames.SHIPPING_TABLE} 
    WHERE DeliveryId = ? 
    AND ItemNumber = ?
`,
    SEARCH_ITEMS: `
        SELECT DISTINCT *
        FROM ${TableNames.SHIPPING_TABLE} 
        WHERE (DeliveryId LIKE ? OR DeliveryLineId LIKE ? OR CustomerName LIKE ?)
        GROUP BY DeliveryId
        ORDER BY ShipDate DESC
    `,
    
    SEARCH_ITEMS_PAGINATED: `
        SELECT DISTINCT *
        FROM ${TableNames.SHIPPING_TABLE} 
        WHERE (DeliveryId LIKE ? OR DeliveryLineId LIKE ? OR CustomerName LIKE ?)
        GROUP BY DeliveryId
        ORDER BY ShipDate DESC
        LIMIT ? OFFSET ?
    `,
    
    SEARCH_BY_BARCODE: `
        SELECT DISTINCT *
        FROM ${TableNames.SHIPPING_TABLE} 
        WHERE (DeliveryId = ? OR DeliveryLineId = ? OR CustomerName = ?)
        GROUP BY DeliveryId
        ORDER BY ShipDate DESC
    `,
    
    UPDATE_LOADED_QUANTITY: `
        UPDATE ${TableNames.SHIPPING_TABLE} 
        SET LoadedQuantity = ?, LastModified = datetime('now')
        WHERE DeliveryId = ? AND ItemId = ? AND ResponsibilityId = 'SHIP_CONFIRM'
    `,
    
    UPDATE_MEDIA_STATUS: `
        UPDATE ${TableNames.SHIPPING_TABLE} 
        SET HasPhotos = ?, HasVideo = ?, LastModified = datetime('now')
        WHERE DeliveryId = ? AND ItemId = ? AND ResponsibilityId = 'SHIP_CONFIRM'
    `,
    
    INSERT_TRANSACTION_HISTORY: `
        INSERT INTO transaction_history (
            MobileTransactionId, DeliveryId, DeliveryLineId, ShipDate, 
            Quantity, PartialAction, ResponsibilityId, UserId, 
            TrackingNumber, FreightCost, ShipMethod, GrossWeight, 
            Status, CreatedAt, RetryCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), 0)
    `,
    
    GET_PENDING_TRANSACTIONS: `
        SELECT * FROM transaction_history 
        WHERE Status = 'pending' AND RetryCount < 3
        ORDER BY CreatedAt ASC
    `,
    
    UPDATE_TRANSACTION_STATUS: `
        UPDATE transaction_history 
        SET Status = ?, ErrorMessage = ?, UpdatedAt = datetime('now')
        WHERE Id = ?
    `,
    
    INCREMENT_RETRY_COUNT: `
        UPDATE transaction_history 
        SET RetryCount = RetryCount + 1, UpdatedAt = datetime('now')
        WHERE Id = ?
    `
};