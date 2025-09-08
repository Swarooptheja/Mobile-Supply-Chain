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
        SET sharePointTransactionStatus = ?, Message = ?, UpdatedAt = ?
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
            TransactionDate TEXT,
            DeliveryLineId TEXT,
            VehicleNumber TEXT,
            DockDoor TEXT,
            LpnNumber TEXT,
            InventoryOrgId TEXT,
            UserId INTEGER,
            ResponsibilityId TEXT,
            ItemsData TEXT,
            EBSTransactionStatus TEXT DEFAULT 'pending',
            sharePointTransactionStatus TEXT DEFAULT 'pending',
            CreatedAt TEXT,
            Message TEXT,
            UpdatedAt TEXT
        )
    `,
    // Enhanced Load to Dock Transaction queries
    INSERT_LOAD_TO_DOCK_TRANSACTION: `
        INSERT INTO ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} (
            MobileTransactionId, TransactionDate, DeliveryLineId, VehicleNumber, DockDoor, 
            LpnNumber, InventoryOrgId, UserId, ResponsibilityId, ItemsData, 
            EBSTransactionStatus, sharePointTransactionStatus, CreatedAt, Message, UpdatedAt 
        ) VALUES (?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?, 
                  ?, ?, ?, ?, ?)
    `,

    
    UPDATE_LOAD_TO_DOCK_TRANSACTION_SHAREPOINT_STATUS: `
        UPDATE ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        SET sharePointTransactionStatus = ?, DeliveryLineId = ?, UpdatedAt = ?
        WHERE MobileTransactionId = ?
    `,
    
    GET_PENDING_LOAD_TO_DOCK_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE sharePointTransactionStatus = 'pending'
    `,

    GET_LOAD_TO_DOCK_TRANSACTION: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE MobileTransactionId = ?
    `,

    // Transaction History queries
    GET_ALL_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_BY_STATUS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE EBSTransactionStatus = ?
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_PAGINATED: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        ORDER BY CreatedAt DESC
        LIMIT ? OFFSET ?
    `,

    // Media storage queries
    INSERT_MEDIA: `
        INSERT INTO ${TableNames.MEDIA_STORAGE} (
            DeliveryId, ItemNumber, MediaType, Base64Data, 
            Size, Duration, Timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,

    // Transaction history queries
    INSERT_TRANSACTION_HISTORY: `
        INSERT INTO transaction_history (
            MobileTransactionId, DeliveryId, DeliveryLineId, ShipDate, 
            Quantity, PartialAction, ResponsibilityId, UserId, 
            TrackingNumber, FreightCost, ShipMethod, GrossWeight
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

};

// Dedicated Transaction History Queries
export const TRANSACTION_HISTORY_QUERIES = {
    // Basic CRUD operations
    GET_ALL_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_BY_STATUS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE EBSTransactionStatus = ?
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_PAGINATED: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        ORDER BY CreatedAt DESC
        LIMIT ? OFFSET ?
    `,

    GET_TRANSACTIONS_COUNT: `
        SELECT COUNT(*) as count FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY}
    `,

    GET_TRANSACTION_BY_ID: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE MobileTransactionId = ?
    `,

    // Advanced filtering and search
    GET_RECENT_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE CreatedAt >= ?
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_BY_DATE_RANGE: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE CreatedAt BETWEEN ? AND ?
        ORDER BY CreatedAt DESC
    `,

    SEARCH_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE MobileTransactionId LIKE ? 
           OR DeliveryLineId LIKE ? 
           OR VehicleNumber LIKE ? 
           OR LpnNumber LIKE ?
        ORDER BY CreatedAt DESC
    `,

    // Statistics and analytics
    GET_TRANSACTION_STATS: `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN sharePointTransactionStatus = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN sharePointTransactionStatus = 'success' THEN 1 ELSE 0 END) as success,
            SUM(CASE WHEN sharePointTransactionStatus = 'failed' THEN 1 ELSE 0 END) as failed
        FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY}
    `,

    GET_TRANSACTION_COUNT_BY_STATUS: `
        SELECT sharePointTransactionStatus as status, COUNT(*) as count
        FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY}
        GROUP BY sharePointTransactionStatus
    `,

    // Status management
    GET_PENDING_TRANSACTIONS: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE sharePointTransactionStatus = 'pending'
        ORDER BY CreatedAt ASC
    `,

    UPDATE_TRANSACTION_STATUS: `
        UPDATE ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        SET sharePointTransactionStatus = ?, Message = ?, UpdatedAt = ?
        WHERE MobileTransactionId = ?
    `,

    // Cleanup operations
    DELETE_TRANSACTION: `
        DELETE FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE MobileTransactionId = ?
    `,

    DELETE_OLD_TRANSACTIONS: `
        DELETE FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE CreatedAt < ? AND EBSTransactionStatus IN ('success', 'failed')
    `,

    // Performance optimization queries
    GET_TRANSACTIONS_BY_USER: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE UserId = ?
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_BY_VEHICLE: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE VehicleNumber = ?
        ORDER BY CreatedAt DESC
    `,

    GET_TRANSACTIONS_BY_DELIVERY: `
        SELECT * FROM ${TableNames.LOAD_TO_DOCK_TRANSACTION_HISTORY} 
        WHERE DeliveryLineId = ?
        ORDER BY CreatedAt DESC
    `
};