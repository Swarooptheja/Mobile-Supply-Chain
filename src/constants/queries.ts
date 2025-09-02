import { TableNames } from "./tables";

export const LOGIN_QUERIES = {
    GET_DEFAULT_ORG_ID: `SELECT DEFAULT_ORG_ID FROM ${TableNames.LOGIN} WHERE DEFAULT_ORG_ID IS NOT NULL AND DEFAULT_ORG_ID != '' LIMIT 1`,
    GET_USER_RESPONSIBILITIES: `SELECT RESPONSIBILITY FROM ${TableNames.LOGIN} WHERE RESPONSIBILITY IS NOT NULL AND RESPONSIBILITY != ''`,
    GET_USER_ID: `SELECT USER_ID FROM ${TableNames.LOGIN} WHERE USER_ID IS NOT NULL AND USER_ID != '' LIMIT 1`,
    
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
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_ORDERS} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_ORDERS} s
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
    `,

    GET_ITEMS_PAGINATED: `
        SELECT 
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_ORDERS} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_ORDERS} s
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
        LIMIT ? OFFSET ?
    `,

    GET_ITEMS_BY_DELIVERY_ID: `
        SELECT *
        FROM ${TableNames.SHIPPING_ORDERS} 
        WHERE DeliveryId = ?
    `,

    SEARCH_ITEMS_BY_ITEM_NUMBER_AND_DESC: `
        SELECT *
        FROM ${TableNames.SHIPPING_ORDERS} 
        WHERE DeliveryId = ? 
        AND (ItemNumber LIKE ? OR ItemDesc LIKE ?)
    `,

    SCAN_ITEMS_BY_ITEM_NUMBER: `
    SELECT *
    FROM ${TableNames.SHIPPING_ORDERS} 
    WHERE DeliveryId = ? 
    AND ItemNumber = ?
`,
    SEARCH_ITEMS: `
        SELECT DISTINCT
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_ORDERS} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_ORDERS} s
        WHERE (s.DeliveryId LIKE ? OR s.DeliveryLineId LIKE ? OR s.CustomerName LIKE ?)
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
    `,

    SEARCH_ITEMS_PAGINATED: `
        SELECT DISTINCT
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_ORDERS} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_ORDERS} s
        WHERE (s.DeliveryId LIKE ? OR s.DeliveryLineId LIKE ? OR s.CustomerName LIKE ?)
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
        LIMIT ? OFFSET ?
    `,

    SEARCH_BY_BARCODE: `
        SELECT DISTINCT
            s.*,
            (SELECT COUNT(*) FROM ${TableNames.SHIPPING_ORDERS} WHERE DeliveryId = s.DeliveryId) as ItemCount
        FROM ${TableNames.SHIPPING_ORDERS} s
        WHERE (s.DeliveryId = ? OR s.DeliveryLineId = ? OR s.CustomerName = ?)
        GROUP BY s.DeliveryId
        ORDER BY s.ShipDate DESC
    `,

    UPDATE_LOADED_QUANTITY: `
        UPDATE ${TableNames.SHIPPING_ORDERS} 
        SET LoadedQuantity = ?, LastModified = datetime('now')
        WHERE DeliveryId = ? AND ItemNumber = ?
    `,

    UPDATE_MEDIA_STATUS: `
        UPDATE ${TableNames.SHIPPING_ORDERS} 
        SET HasPhotos = ?, HasVideo = ?, LastModified = datetime('now')
        WHERE DeliveryId = ? AND ItemNumber = ?
    `,

    GET_PENDING_TRANSACTIONS: `
        SELECT * FROM transaction_history 
        WHERE Status = 'pending' AND RetryCount < 3
        ORDER BY CreatedAt ASC
    `,

    UPDATE_TRANSACTION_STATUS: `
        UPDATE ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        SET EBSTransactionStatus = ?, Message = ?, UpdatedAt = ?
        WHERE MobileTransactionId = ?
    `,

    // Media storage queries

    GET_MEDIA_BY_ITEM: `
        SELECT * FROM ${TableNames.MEDIA_STORAGE} 
        WHERE DeliveryId = ? AND ItemNumber = ?
        ORDER BY Timestamp DESC
    `,

    DELETE_MEDIA_BY_ITEM: `
        DELETE FROM ${TableNames.MEDIA_STORAGE} 
        WHERE DeliveryId = ? AND ItemNumber = ?
    `,

    CREATE_LOAD_TO_DOCK_TRANSACTION_TABLE: `
        CREATE TABLE IF NOT EXISTS ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} (
            MobileTransactionId TEXT PRIMARY KEY,
            TransactionDate TEXT NOT NULL,
            DeliveryLineId TEXT NOT NULL,
            VehicleNumber TEXT NOT NULL,
            DockDoor TEXT NOT NULL,
            LpnNumber TEXT NOT NULL,
            InventoryOrgId TEXT NOT NULL,
            UserId INTEGER NOT NULL,
            ResponsibilityId TEXT NOT NULL,
            ItemsData TEXT NOT NULL,
            EBSTransactionStatus TEXT DEFAULT 'pending',
            sharePointTransactionStatus TEXT DEFAULT 'pending',
            CreatedAt TEXT NOT NULL,
            Message TEXT
        )
    `,
    // Enhanced Load to Dock Transaction queries
    INSERT_LOAD_TO_DOCK_TRANSACTION: `
        INSERT INTO ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} (
            MobileTransactionId, TransactionDate, DeliveryLineId, VehicleNumber, DockDoor, 
            LpnNumber, InventoryOrgId, UserId, ResponsibilityId, ItemsData, 
            EBSTransactionStatus, sharePointTransactionStatus, CreatedAt, Message
        ) VALUES (?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?, 
                  ?, ?, ?, ?)
    `,

    
    UPDATE_LOAD_TO_DOCK_TRANSACTION_SHAREPOINT_STATUS: `
        UPDATE ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        SET sharePointTransactionStatus = ?, DeliveryLineId = ?, UpdatedAt = ?
        WHERE MobileTransactionId = ?
    `,
    
    GET_PENDING_LOAD_TO_DOCK_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE EBSTransactionStatus = 'pending'
    `,

    GET_LOAD_TO_DOCK_TRANSACTION: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE MobileTransactionId = ?
    `

};