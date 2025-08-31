import { TableNames } from "./tables";

export const LOGIN_QUERIES = {
    GET_DEFAULT_ORG_ID: `SELECT DEFAULT_ORG_ID FROM ${TableNames.LOGIN} WHERE DEFAULT_ORG_ID IS NOT NULL AND DEFAULT_ORG_ID != '' LIMIT 1`,
    GET_USER_RESPONSIBILITIES: `SELECT RESPONSIBILITY FROM ${TableNames.LOGIN} WHERE RESPONSIBILITY IS NOT NULL AND RESPONSIBILITY != ''`,
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
        SELECT 
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_TABLE} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_TABLE} s
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
    `,
    
    GET_ITEMS_PAGINATED: `
        SELECT 
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_TABLE} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_TABLE} s
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
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
        SELECT DISTINCT
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_TABLE} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_TABLE} s
        WHERE (s.DeliveryId LIKE ? OR s.DeliveryLineId LIKE ? OR s.CustomerName LIKE ?)
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
    `,
    
    SEARCH_ITEMS_PAGINATED: `
        SELECT DISTINCT
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_TABLE} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_TABLE} s
        WHERE (s.DeliveryId LIKE ? OR s.DeliveryLineId LIKE ? OR s.CustomerName LIKE ?)
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
        LIMIT ? OFFSET ?
    `,
    
    SEARCH_BY_BARCODE: `
        SELECT DISTINCT
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_TABLE} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_TABLE} s
        WHERE (s.DeliveryId = ? OR s.DeliveryLineId = ? OR s.CustomerName = ?)
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
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
    `,
    
    // Media storage queries
    CREATE_MEDIA_TABLE: `
        CREATE TABLE IF NOT EXISTS ${TableNames.MEDIA_STORAGE} (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            DeliveryId TEXT NOT NULL,
            ItemId TEXT NOT NULL,
            MediaType TEXT NOT NULL CHECK(MediaType IN ('photo', 'video')),
            Base64Content TEXT NOT NULL,
            FileSize INTEGER,
            Duration REAL,
            Timestamp INTEGER,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(DeliveryId, ItemId, MediaType, Timestamp)
        )
    `,
    
    INSERT_MEDIA: `
        INSERT INTO ${TableNames.MEDIA_STORAGE} 
        (DeliveryId, ItemId, MediaType, Base64Content, FileSize, Duration, Timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    
    GET_MEDIA_BY_ITEM: `
        SELECT * FROM ${TableNames.MEDIA_STORAGE} 
        WHERE DeliveryId = ? AND ItemId = ?
        ORDER BY Timestamp DESC
    `,
    
    DELETE_MEDIA_BY_ITEM: `
        DELETE FROM ${TableNames.MEDIA_STORAGE} 
        WHERE DeliveryId = ? AND ItemId = ?
    `
};