import { apiPost, getCurrentServerDate, getDataFromResultSet, getLocalTransactionId } from '../../services/sharedService';
import { API_ENDPOINTS, buildApiUrl, getApiHeaders } from '../config/api';
import { LOAD_TO_DOCK_QUERIES } from '../constants/queries';
import { ILoadToDockItem, ILoadToDockItemDetail, ILoadToDockTransaction, ILoadToDockTransactionRequest, ITransactionResponse } from '../types/loadToDock.interface';
import { networkService } from './api';
import { mediaUploadService, PurpleDBUploadRequest } from './mediaUploadService';
import { simpleDatabaseService } from './simpleDatabase';

// New interfaces for the enhanced Load to Dock functionality
export interface LoadToDockRequest {
  // deliveryId: string;
  vehicleNumber: string;
  dockDoor: string;
  inventoryOrgId: string | null | undefined;
  userId: number;
  responsibilityId: string;
  items: Array<ILoadToDockItemDetail>;
}

export interface LoadToDockTransactionInput {
  MobileTransactionId: number;
  InventoryOrgId: string;
  DockDoor: string;
  LpnNumber: string;
  TransactionDate: string;
  UserId: string;
  ResponsibilityId: string;
}

export interface LoadToDockTransactionResponse {
  MobileTransactionId: number;
  ReturnStatus: 'S' | 'E';
  ReturnMessage: string;
}

export interface LoadToDockApiResponse {
  Response: LoadToDockTransactionResponse[];
}

export interface LoadToDockResult {
  success: boolean;
  error?: string;
  offline?: boolean;
}

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
          QtyPicked: item.QtyPicked || "0", // Ensure QtyPicked has a default value
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
          QtyPicked: item.QtyPicked || "0", // Ensure QtyPicked has a default value
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
          QtyPicked: item.QtyPicked || "0", // Ensure QtyPicked has a default value
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
  async updateMediaStatus(deliveryId: string, itemNumber: string, hasPhotos: boolean, hasVideo: boolean): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.UPDATE_MEDIA_STATUS, [hasPhotos ? 1 : 0, hasVideo ? 1 : 0, deliveryId, itemNumber]);
    } catch (error) {
      console.error('Error updating media status:', error);
      throw new Error('Failed to update media status');
    }
  }

  /**
   * Store media content with base64 data
   */
  async storeMediaContent(deliveryId: string, itemNumber: string, mediaItems: any[]): Promise<void> {
    try {
      // First, delete existing media for this item
      await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.DELETE_MEDIA_BY_ITEM, [deliveryId, itemNumber]);
      
      // Insert new media items
      for (const media of mediaItems) {
        await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.INSERT_MEDIA, [
          deliveryId,
          itemNumber,
          media.type,
          media.base64,
          media.size || 0,
          media.duration || null,
          media.timestamp || Date.now()
        ]);
      }
    } catch (error) {
      console.error('Error storing media content:', error);
      throw new Error('Failed to store media content');
    }
  }

  /**
   * Get media content for an item
   */
  async getMediaContent(deliveryId: string, itemId: string): Promise<any[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_MEDIA_BY_ITEM, [deliveryId, itemId]);
      return getDataFromResultSet(result);
    } catch (error) {
      console.error('Error fetching media content:', error);
      throw new Error('Failed to fetch media content');
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
   * Main method to process Load to Dock with offline/online handling
   */
  async processLoadToDock(request: LoadToDockRequest): Promise<LoadToDockResult> {
    try {
      // Step 1: Store in transaction history table
      await this.storeLoadToDockTransaction(request);

      // Step 2: Check network status
      const isOnline = await networkService.isOnline();
      console.log('🌐 Network status:', isOnline ? 'ONLINE' : 'OFFLINE');

      if (!isOnline) {
        // Step 3a: OFFLINE - Show message and stop
        return ({
          success: true,
          offline: true,
          error: 'Data saved locally. Will sync when online.'
        });
      }

      // Step 3b: ONLINE - Proceed with API calls
      return await this.processOnlineLoadToDock();

    } catch (error) {
      console.error('❌ Error in Load to Dock process:', error);
      return({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Store Load to Dock transaction in local database
   */
  private async storeLoadToDockTransaction(request: LoadToDockRequest): Promise<void> {    
    try {
      // Store individual item transactions
      for (const item of request?.items) {
        await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.INSERT_LOAD_TO_DOCK_TRANSACTION, [
          getLocalTransactionId(),
          getCurrentServerDate(),
          item.DeliveryLineId,
          request.vehicleNumber,
          request.dockDoor,
          item.PackedLpnNumber,
          request.inventoryOrgId,
          request.userId,
          request.responsibilityId,
          JSON.stringify(item),
          'pending',
          'pending',
          new Date().toISOString(),
          ''

        ]);
      }

    } catch (error) {
      console.error('Error storing transaction:', error);
      throw new Error('Failed to store transaction in local database');
    }
  }

  /**
   * Process Load to Dock when online
   */
  private async processOnlineLoadToDock(): Promise<LoadToDockResult> {
    try {
      // Step 4: POST API Transaction to EBS
      const pendingTransactions: ILoadToDockTransactionRequest[] = await this.getPendingLoadToDockTransactions();
      if (!pendingTransactions.length) {
        console.log('No pending transactions to process');
        return ({
          success: true,
        });
      }
      const transactionResponse = await this.postLoadToDockTransaction(pendingTransactions);
      console.log('📤 Transaction API response:', transactionResponse);

      if (!transactionResponse.success) {
        throw new Error(transactionResponse.error || 'Transaction API failed');
      }

      return ({
        success: true,
      });

    } catch (error) {
      console.error('❌ Error in online processing:', error);
      throw error;
    }
  }

  /**
   * POST API call to EBS createLoadtoDockwms endpoint
   */
  private async postLoadToDockTransaction(request: ILoadToDockTransactionRequest[]): Promise<{ success: boolean; error?: string }> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.CREATE_LOAD_TO_DOCK_WMS);
      
      // Create transaction inputs for each item
      const transactionInputs: LoadToDockTransactionInput[] = request.map((item: ILoadToDockTransactionRequest) => ({
        MobileTransactionId: item.MobileTransactionId, // Unique transaction ID
        InventoryOrgId: item.InventoryOrgId,
        DockDoor: item.DockDoor,
        LpnNumber: item.LpnNumber,
        TransactionDate: item.TransactionDate,
        UserId: item.UserId,
        ResponsibilityId: item.ResponsibilityId
      }));

      const requestBody = {
        Input: transactionInputs
      };

      console.log('📤 Sending transaction to EBS:', requestBody);

      const response = await apiPost<LoadToDockApiResponse>(url, requestBody, {
        ...getApiHeaders()
      });

      console.log('📥 EBS API response:', response.data);

      // Check response status
      if (response.data && response.data.Response) {
         await this.updateTransactionStatus(response.data.Response);

        const failedTransactions = response.data.Response.filter(t => t.ReturnStatus.toLowerCase() === 'e');
        
        if (failedTransactions.length) {
          const errorMessages = failedTransactions.map(t => t.ReturnMessage).join('; ');
          return ({
            success: false,
            error: `Transaction failed: ${errorMessages}`
          });
        }

        return({ 
          success: true
         });
      }

      return ({
        success: false,
        error: 'Invalid response format from EBS API'
      });

    } catch (error) {
      console.error('Error posting transaction to EBS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'EBS API call failed'
      };
    }
  }

  /**
   * Upload media to Purple DB
   */
  private async uploadMediaToPropelDB(request: ILoadToDockTransactionRequest[]): Promise<any[]> {
    const uploadRequests: PurpleDBUploadRequest[] = [];
    for(let i = 0; i < request.length; i++) {
      const element = request[i];
      const data = JSON.parse(element.ItemsData);
      const mediaItems = data.mediaItems;
      const mediaUploadRequests = mediaItems.map((mediaItem: any) => ({
        customerNumber: data.deliveryId, // Using deliveryId as customerNumber
        documentType: 'LoadToDock',
        documentNumber: data.deliveryId,
        mediaItem
      }));
      uploadRequests.push(...mediaUploadRequests);
    }

    return await mediaUploadService.uploadMultipleMedia(uploadRequests);
  }

  /**
   * Update transaction status in database
   */
  private async updateTransactionStatus(response: LoadToDockTransactionResponse[]): Promise<void> {
    try {
      const promises = [];
      
      for (let i = 0; i < response.length; i++) {
        const element = response[i];
        
        // Determine sync status based on ReturnStatus
        let syncStatus = 'pending';
        let syncMessage = element.ReturnMessage || '';
        
          if (element.ReturnStatus.toLowerCase() === 'e') {
            syncStatus = 'failed';
            syncMessage = element.ReturnMessage || 'Transaction failed';
          } else if (element.ReturnStatus.toLowerCase() === 's') {
            syncStatus = 'success';
            syncMessage = element.ReturnMessage || 'Transaction completed successfully';
            const request = await this.getLoadToDockTransaction(element.MobileTransactionId);
            // await this.uploadMediaToPropelDB(request);
          }
        
        // Create update promise for each transaction
        const updatePromise = simpleDatabaseService.executeQuery(
          LOAD_TO_DOCK_QUERIES.UPDATE_TRANSACTION_STATUS, 
          [
            syncStatus,
            syncMessage,
            new Date().toISOString(),
            element.MobileTransactionId
          ]
        );
        
        promises.push(updatePromise);
      }
      
      // Execute all updates in parallel
      await Promise.all(promises);
      
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  /**
   * Get load to dock transaction by mobile transaction id
   */
  async getLoadToDockTransaction(mobileTransactionId: number): Promise<ILoadToDockTransactionRequest[]> {
    const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_LOAD_TO_DOCK_TRANSACTION, [mobileTransactionId]);
    return getDataFromResultSet(result);
  }
  /**
   * Get pending transactions for retry
   */
  async getPendingLoadToDockTransactions(): Promise<any[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_PENDING_LOAD_TO_DOCK_TRANSACTIONS);
      return getDataFromResultSet(result);
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      return [];
    }
  };

}

export const loadToDockService = new LoadToDockService();
