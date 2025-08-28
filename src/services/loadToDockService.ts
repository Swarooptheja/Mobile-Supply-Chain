import { getDataFromResultSet } from '../../services/sharedService';
import { ILoadToDockItem, ILoadToDockItemDetail, ILoadToDockTransaction, ITransactionResponse } from '../types/loadToDock.interface';
import { simpleDatabaseService } from './simpleDatabase';
import { LOAD_TO_DOCK_QUERIES } from '../constants/queries';

class LoadToDockService {
  /**
   * Get all Load to Dock items from SQLite database
   */
  async getLoadToDockItems(): Promise<ILoadToDockItem[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_ALL_ITEMS);
      const loadToDockItems = getDataFromResultSet(result);
      return loadToDockItems.map((row: any) => ({
        deliveryId: row.DeliveryId.toString(),
        salesOrderNumber: row.SalesOrderNum,
        customerName: row.CustomerName,
        tripNumber: row.TripNumber || 'N/A',
        date: row.DeliveryDate || 'N/A',
        dock: row.DockNumber || 'DOCK-02',
        itemCount: row.ItemCount || 0,
        status: row.Status || 'pending'
      }));
    } catch (error) {
      console.error('Error fetching Load to Dock items:', error);
      throw new Error('Failed to fetch Load to Dock items');
    }
  }

  /**
   * Get paginated Load to Dock items from SQLite database
   */
  async getLoadToDockItemsPaginated(page: number, pageSize: number): Promise<ILoadToDockItem[]> {
    try {
      const offset = (page - 1) * pageSize;
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_ITEMS_PAGINATED, [pageSize, offset]);
      const loadToDockItems = getDataFromResultSet(result);
      return loadToDockItems.map((row: any) => ({
        deliveryId: row.DeliveryId.toString(),
        salesOrderNumber: row.SalesOrderNum,
        customerName: row.CustomerName,
        tripNumber: row.TripNumber || 'N/A',
        date: row.DeliveryDate || 'N/A',
        dock: row.DockNumber || 'DOCK-02',
        itemCount: row.ItemCount || 0,
        status: row.Status || 'pending'
      }));
    } catch (error) {
      console.error('Error fetching paginated Load to Dock items:', error);
      throw new Error('Failed to fetch paginated Load to Dock items');
    }
  }

  /**
   * Get items for a specific delivery ID
   */
  async getItemsByDeliveryId(deliveryId: string): Promise<ILoadToDockItemDetail[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_ITEMS_BY_DELIVERY_ID, [deliveryId]);
      const items = getDataFromResultSet(result);

      return items.map((item)=>{
        return ({
          ...item,
          hasPhotos: Boolean(item.HasPhotos),
          hasVideo: Boolean(item.HasVideo)
        })
      })
    } catch (error) {
      console.error('Error fetching items for delivery:', error);
      throw new Error('Failed to fetch delivery items');
    }
  }

  /**
   * Search items within a specific delivery by search term
   */
  async searchItemsByDeliveryId(deliveryId: string, searchTerm: string): Promise<ILoadToDockItemDetail[]> {
    try {
      const searchPattern = `%${searchTerm}%`;
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.SEARCH_ITEMS_BY_ITEM_NUMBER_AND_DESC, [deliveryId, searchPattern, searchPattern]);
      const items = getDataFromResultSet(result);

      return items.map((item)=>{
        return ({
          ...item,
          hasPhotos: Boolean(item.HasPhotos),
          hasVideo: Boolean(item.HasVideo)
        })
      })
    } catch (error) {
      console.error('Error searching items within delivery:', error);
      throw new Error('Failed to search delivery items');
    }
  }

  /**
   * Scan items within a specific delivery by barcode
   */
  async scanItemsByDeliveryId(deliveryId: string, barcode: string): Promise<ILoadToDockItemDetail[]> {
    try {
      // const searchPattern = `%${barcode}%`;
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.SCAN_ITEMS_BY_ITEM_NUMBER, [deliveryId, barcode]);
      const items = getDataFromResultSet(result);

      return items.map((item)=>{
        return ({
          ...item,
          hasPhotos: Boolean(item.HasPhotos),
          hasVideo: Boolean(item.HasVideo)
        })
      })
    } catch (error) {
      console.error('Error searching items within delivery:', error);
      throw new Error('Failed to search delivery items');
    }
  }

  /**
   * Search Load to Dock items with pagination
   */
  async searchLoadToDockItemsPaginated(searchTerm: string, page: number, pageSize: number): Promise<ILoadToDockItem[]> {
    try {
      const searchPattern = `%${searchTerm}%`;
      const offset = (page - 1) * pageSize;
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.SEARCH_ITEMS_PAGINATED, [searchPattern, searchPattern, searchPattern, pageSize, offset]);
      
      const items = getDataFromResultSet(result);
      return items.map((row: any) => ({
        deliveryId: row.DeliveryId.toString(),
        salesOrderNumber: row.SalesOrderNum || 'N/A',
        customerName: row.CustomerName || 'N/A',
        tripNumber: row.TripNumber || 'N/A',
        date: row.ShipDate || 'N/A',
        dock: row.DockNumber || 'N/A',
        itemCount: row.ItemCount || 0,
        status: row.Status || 'pending'
      }));
    } catch (error) {
      console.error('Error searching paginated Load to Dock items:', error);
      throw new Error('Failed to search paginated Load to Dock items');
    }
  }

  /**
   * Search Load to Dock items by barcode (DeliveryId, ItemSku, or ItemId)
   */
  async searchByBarcode(barcode: string): Promise<ILoadToDockItem[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.SEARCH_BY_BARCODE, [barcode, barcode, barcode]);
      const items = getDataFromResultSet(result);
      return items.map((row: any) => ({
        deliveryId: row.DeliveryId.toString(),
        salesOrderNumber: row.SalesOrderNum || 'N/A',
        customerName: row.CustomerName || 'N/A',
        tripNumber: row.TripNumber || 'N/A',
        date: row.ShipDate || 'N/A',
        dock: row.DockNumber || 'N/A',
        itemCount: row.ItemCount || 0,
        status: row.Status || 'pending'
      }));
    } catch (error) {
      console.error('Error searching by barcode:', error);
      throw new Error('Failed to search by barcode');
    }
  }

  /**
   * Update loaded quantity for an item
   */
  async updateLoadedQuantity(deliveryId: string, itemId: string, quantity: number): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.UPDATE_LOADED_QUANTITY, [quantity, deliveryId, itemId]);
    } catch (error) {
      console.error('Error updating loaded quantity:', error);
      throw new Error('Failed to update loaded quantity');
    }
  }

  /**
   * Update photo/video status for an item
   */
  async updateMediaStatus(deliveryId: string, itemId: string, hasPhotos: boolean, hasVideo: boolean): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.UPDATE_MEDIA_STATUS, [hasPhotos ? 1 : 0, hasVideo ? 1 : 0, deliveryId, itemId]);
    } catch (error) {
      console.error('Error updating media status:', error);
      throw new Error('Failed to update media status');
    }
  }

  /**
   * Create ship confirm transaction
   */
  async createShipConfirmTransaction(transaction: ILoadToDockTransaction): Promise<ITransactionResponse[]> {
    try {
      const payload = {
        Input: [transaction]
      };

      // TODO: Replace with actual API endpoint
      const response = await fetch('https://{host}/{project}/{version}/createShipConfirmTransactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.Success) {
        return result.Response;
      } else {
        throw new Error('Transaction creation failed');
      }
    } catch (error) {
      console.error('Error creating ship confirm transaction:', error);
      throw new Error('Failed to create transaction');
    }
  }

  /**
   * Store transaction in local database for offline retry
   */
  async storePendingTransaction(transaction: ILoadToDockTransaction): Promise<void> {
    try {
      const freightCostJson = JSON.stringify(transaction.freightCost);
      
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.INSERT_TRANSACTION_HISTORY, [
        transaction.mobileTransactionId,
        transaction.deliveryId,
        transaction.deliveryLineId,
        transaction.shipDate,
        transaction.quantity,
        transaction.partialAction,
        transaction.responsibilityId,
        transaction.userId,
        transaction.trackingNumber,
        freightCostJson,
        transaction.shipMethod,
        transaction.grossWeight
      ]);
    } catch (error) {
      console.error('Error storing pending transaction:', error);
      throw new Error('Failed to store pending transaction');
    }
  }

  /**
   * Get pending transactions for retry
   */
  async getPendingTransactions(): Promise<ILoadToDockTransaction[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_PENDING_TRANSACTIONS);
      const transactions = getDataFromResultSet(result);
      return transactions.map((row: any) => ({
        mobileTransactionId: row.MobileTransactionId,
        deliveryId: row.DeliveryId,
        deliveryLineId: row.DeliveryLineId,
        shipDate: row.ShipDate,
        quantity: row.Quantity,
        partialAction: row.PartialAction,
        responsibilityId: row.ResponsibilityId,
        userId: row.UserId,
        trackingNumber: row.TrackingNumber,
        freightCost: JSON.parse(row.FreightCost),
        shipMethod: row.ShipMethod,
        grossWeight: row.GrossWeight
      }));
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      throw new Error('Failed to fetch pending transactions');
    }
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(transactionId: number, status: 'success' | 'failed', errorMessage?: string): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.UPDATE_TRANSACTION_STATUS, [status, errorMessage || null, transactionId]);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw new Error('Failed to update transaction status');
    }
  }

  /**
   * Increment retry count for failed transaction
   */
  async incrementRetryCount(transactionId: number): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.INCREMENT_RETRY_COUNT, [transactionId]);
    } catch (error) {
      console.error('Error incrementing retry count:', error);
      throw new Error('Failed to increment retry count');
    }
  }
}

export const loadToDockService = new LoadToDockService();
