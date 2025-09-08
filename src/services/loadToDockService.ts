import { getCurrentServerDate, getDataFromResultSet, getLocalTransactionId } from '../../services/sharedService';
import { API_ENDPOINTS, buildApiUrl } from '../config/api';
import { LOAD_TO_DOCK_QUERIES } from '../constants/queries';
import { ILoadToDockItem, ILoadToDockItemDetail, ILoadToDockTransaction, ILoadToDockTransactionRequest, ITransactionResponse, IUploadDocumentResponse } from '../types/loadToDock.interface';
import { IMediaItem } from '../types/media.interface';
import { networkService } from './networkService';
import { simpleDatabaseService } from './simpleDatabase';
import { transactionHistoryService } from './transactionHistoryService';

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

// New interfaces for PropelDB document upload
export interface PropelDBUploadData {
  customerNumber: string;
  documentType: string;
  documentNumber: string;
  files: PropelDBFile[];
}

export interface PropelDBFile {
  base64: string;
  type: string;
  size: number;
  duration?: number | null;
  uri: string;
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
  // async processLoadToDock(): Promise<LoadToDockResult> {
  //   try {

  //     // Step 2: Check network status
  //     // const isOnline = await networkService.isOnline();
  //     // console.log('🌐 Network status:', isOnline ? 'ONLINE' : 'OFFLINE');

  //     // if (!isOnline) {
  //     //   // Step 3a: OFFLINE - Show message and stop
  //     //   return ({
  //     //     success: true,
  //     //     offline: true,
  //     //     error: 'Data saved locally. Will sync when online.'
  //     //   });
  //     // }

  //     // Step 3b: ONLINE - Proceed with API calls
  //     return await this.processOnlineLoadToDock();

  //   } catch (error) {
  //     console.error('❌ Error in Load to Dock process:', error);
  //     return({
  //       success: false,
  //       error: error instanceof Error ? error.message : 'Unknown error'
  //     });
  //   }
  // }

  /**
   * Store Load to Dock transaction in local database
   */
 async storeLoadToDockTransaction(request: LoadToDockRequest): Promise<{success: boolean, error?: string}> {    
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
          '',
          ''
        ]);
      }
      return ({
        success: true,
      })

    } catch (error) {
      console.error('Error storing transaction:', error);
      throw new Error('Failed to store transaction in local database');
    }
  }

  /**
   * Process Load to Dock when online
   */
  async processOnlineLoadToDock(): Promise<LoadToDockResult> {
    try {
      // Step 4: POST API Transaction to EBS
      const pendingTransactions: ILoadToDockTransactionRequest[] = await this.getPendingLoadToDockTransactions();
      if (!pendingTransactions.length) {
        console.log('No pending transactions to process');
        return ({
          success: true,
        });
      }
      // const transactionResponse = await this.postLoadToDockTransaction(pendingTransactions);
      const transactionResponse = await this.uploadMediaToPropelDB(pendingTransactions);
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
   * COMMENTED OUT - Replaced with PropelDB document upload API
   */
  private async postLoadToDockTransaction(_request: ILoadToDockTransactionRequest[]): Promise<{ success: boolean; error?: string }> {
    // TODO: This method has been commented out as we're now using PropelDB document upload API
    // The original EBS API implementation is preserved below for reference:
    /*
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
    */

    // For now, return success to maintain existing flow
    // This will be replaced with PropelDB upload logic
    console.log('📤 EBS API call commented out - using PropelDB upload instead');
    return {
      success: true
    };
  }

  /**
   * Upload media to PropelDB using the new document upload API
   */
  private async uploadMediaToPropelDB(request: ILoadToDockTransactionRequest[]): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📤 Starting PropelDB document upload for', request.length, 'transactions');
      
      // Process each transaction and upload associated media
      for (const transaction of request) {
        const uploadResult = await this.uploadTransactionMediaToPropelDB(transaction);
        
        if (!uploadResult.success) {
          console.error('❌ Failed to upload media for transaction:', transaction.MobileTransactionId, uploadResult.error);
          // Continue with other transactions even if one fails
        } else {
          console.log('✅ Successfully uploaded media for transaction:', transaction.MobileTransactionId);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error in PropelDB media upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PropelDB upload failed'
      };
    }
  }

  /**
   * Upload media for a single transaction to PropelDB
   */
  private async uploadTransactionMediaToPropelDB(transaction: ILoadToDockTransactionRequest): Promise<{ success: boolean; error?: string }> {
    try {
      // Parse the ItemsData to get delivery and item information
      const itemsData: ILoadToDockItemDetail = JSON.parse(transaction.ItemsData);
      // const deliveryId = itemsData.DeliveryId;
      // const itemNumber = itemsData.ItemNumber;
      
      // Get media content from database
      const mediaContent: IMediaItem[] = itemsData.mediaData?.capturedMedia || [];
      
      if (!mediaContent || !mediaContent.length) {
        console.log('📷 No media content found for transaction:', transaction.MobileTransactionId);
        return { success: true }; // No media to upload is not an error
      }
      
      // Prepare upload data
      const uploadData = await this.preparePropelDBUploadData(itemsData, mediaContent);
      
      // Upload to PropelDB
      const uploadResult = await this.postToPropelDB(uploadData, transaction.MobileTransactionId);
      
      if (uploadResult.success) {
        const data = uploadResult.data || [];
        await this.updateTransactionStatus(data);

        // Update transaction status to indicate successful media upload
        // await this.updateTransactionSharePointStatus(transaction.MobileTransactionId, 'success');
      }
      
      return uploadResult;
    } catch (error) {
      console.error('❌ Error uploading transaction media:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction media upload failed'
      };
    }
  }

  /**
   * Prepare data for PropelDB upload
   */
  private async preparePropelDBUploadData(itemsData: ILoadToDockItemDetail, mediaContent: IMediaItem[]): Promise<PropelDBUploadData> {
    try {
      // Parse transaction data to extract required fields
      // const itemsData: ILoadToDockItemDetail = JSON.parse(transaction.ItemsData);
      
      // Extract customer number from transaction data
      // This might need to be adjusted based on your actual data structure
      const customerNumber = itemsData.CustomerName || 'CUST2509'; // Default fallback
      
      // Determine document type based on media content
      const hasVideo = mediaContent.some(media => media.type === 'video');
      const documentType = hasVideo ? 'video' : 'photo';
      
      // Use delivery ID as document number
      const documentNumber = itemsData.DeliveryLineId;
      
      // Prepare files array with base64 data
      const files = mediaContent.map(media => ({
        base64: media.base64,
        type: media.type,
        size: media.size || 0,
        duration: media.duration || null,
        uri: media.uri
      }));
      
      return ({
        customerNumber,
        documentType,
        documentNumber,
        files
      });
    } catch (error) {
      console.error('❌ Error preparing PropelDB upload data:', error);
      throw new Error('Failed to prepare upload data');
    }
  }

  /**
 * Prepare data for PropelDB upload
 */
// private async preparePropelDBUploadData(itemsData: ILoadToDockItemDetail, mediaContent: IMediaItem[]): Promise<PropelDBUploadData> {
//   try {
//     // Parse transaction data to extract required fields
//     // const itemsData: ILoadToDockItemDetail = JSON.parse(transaction.ItemsData);
    
//     // Extract customer number from transaction data
//     // This might need to be adjusted based on your actual data structure
//     const customerNumber = itemsData.CustomerName || 'CUST2509'; // Default fallback
    
//     // Filter out media items that don't have valid base64 data
//     const validMediaContent = mediaContent.filter(media => {
//       const hasValidBase64 = media.base64 && media.base64.length > 0;
//       if (!hasValidBase64) {
//         console.warn(`⚠️ Skipping media item with invalid base64 data:`, {
//           type: media.type,
//           size: media.size,
//           base64Length: media.base64?.length || 0
//         });
//       }
//       return hasValidBase64;
//     });
    
//     if (validMediaContent.length === 0) {
//       throw new Error('No valid media content found for upload');
//     }
    
//     // Determine document type based on valid media content
//     const hasVideo = validMediaContent.some(media => media.type === 'video');
//     const documentType = hasVideo ? 'video' : 'photo';
    
//     // Use delivery ID as document number
//     const documentNumber = itemsData.DeliveryLineId;
    
//     // Prepare files array with base64 data
//     const files = validMediaContent.map(media => ({
//       base64: media.base64,
//       type: media.type,
//       size: media.size || 0,
//       duration: media.duration || null
//     }));
    
//     console.log(`📋 Prepared ${files.length} valid files for upload (filtered out ${mediaContent.length - validMediaContent.length} invalid files)`);
    
//     return ({
//       customerNumber,
//       documentType,
//       documentNumber,
//       files
//     });
//   } catch (error) {
//     console.error('❌ Error preparing PropelDB upload data:', error);
//     throw new Error('Failed to prepare upload data');
//   }
// }

  /**
   * POST request to PropelDB document upload API
   */
  // private async postToPropelDB(uploadData: PropelDBUploadData, mobileTransactionId: number): Promise<{ success: boolean; error?: string, data?: IUploadDocumentResponse[] }> {
  //   try {
  //     const url = buildApiUrl(API_ENDPOINTS.UPLOAD_DOCUMENTS_TO_PROPELDB);
      
  //     // Create FormData for multipart form upload
  //     const formData = new FormData();
      
  //     // Add form fields
  //     formData.append('customerNumber', uploadData.customerNumber);
  //     formData.append('documentType', uploadData.documentType);
  //     formData.append('documentNumber', uploadData.documentNumber);
  //     formData.append('MobileTransactionId', mobileTransactionId);
      
  //     // Add files to FormData
  //     for (let i = 0; i < uploadData.files.length; i++) {
  //       const file = uploadData.files[i];
        
  //       // Process base64 data for file upload
  //       const base64Data = await this.base64ToBlob(file.base64, file.type);
        
  //       // Create file name with timestamp
  //       const fileName = `${uploadData.documentNumber}_${file.type}_${Date.now()}_${i}.${file.type === 'video' ? 'mp4' : 'jpg'}`;
        
  //       // For React Native, create a file object with base64 data
  //       const fileObject = {
  //         uri: `data:${file.type === 'video' ? 'video/mp4' : 'image/jpeg'};base64,${base64Data}`,
  //         type: file.type === 'video' ? 'video/mp4' : 'image/jpeg',
  //         name: fileName
  //       };
        
  //       formData.append('files', fileObject as any);
  //     }
      
  //     console.log('📤 Uploading to PropelDB:', {
  //       customerNumber: uploadData.customerNumber,
  //       documentType: uploadData.documentType,
  //       documentNumber: uploadData.documentNumber,
  //       fileobjects: formData,
  //       fileCount: uploadData.files.length
  //     });
      
  //     // Make the API call
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Accept': 'application/json',
  //         // Don't set Content-Type header - let fetch set it with boundary for FormData
  //       }
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`PropelDB API request failed: ${response.status} - ${errorText}`);
  //     }
      
  //     const result = await response.json();
  //     console.log('📥 PropelDB API response:', result);

  //     // const response = await apiPost<any>(url, formData, {
  //     //   ...getApiHeaders()
  //     // });

  //     if (result.data && result.data.Response) {
  //       return ({ 
  //         success: true,
  //         data: result.data.Response
  //       });
  //     } else {
  //       console.warn('⚠️ PropelDB API response missing expected data:', result.data);
  //       return ({
  //         success: false, 
  //         error: 'PropelDB API request failed - invalid response format',
  //       });
  //     }
      
  //   } catch (error) {
  //     console.error('❌ Error posting to PropelDB:', error);
  //     return {
  //       success: false,
  //       error: error instanceof Error ? error.message : 'PropelDB API call failed'
  //     };
  //   }
  // }

  private async postToPropelDB(uploadData: PropelDBUploadData, mobileTransactionId: number): Promise<{ success: boolean; error?: string, data?: IUploadDocumentResponse[] }> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.UPLOAD_DOCUMENTS_TO_PROPELDB);
      
      // Create FormData for multipart form upload
      const formData = new FormData();
      
      // Add form fields
      formData.append('customerNumber', uploadData.customerNumber);
      formData.append('documentType', uploadData.documentType);
      formData.append('documentNumber', uploadData.documentNumber);
      formData.append('MobileTransactionId', mobileTransactionId.toString());
      
      // Add files to FormData
      for (let i = 0; i < uploadData.files.length; i++) {
        const file = uploadData.files[i];
        
        // Create file name with timestamp
        const fileName = `${uploadData.documentNumber}_${file.type}_${Date.now()}_${i}.${file.type === 'video' ? 'mp4' : 'jpg'}`;
        
        // For React Native, create a proper file object
        const fileObject = {
          uri: file.uri,
          type: file.type === 'video' ? 'video/mp4' : 'image/jpeg',
          name: fileName
        };
        
        console.log(`📎 Adding file ${i}:`, {
          name: fileName,
          type: fileObject.type,
          base64Length: file.base64.length,
          base64Preview: file.base64.substring(0, 50) + '...',
          uri: file.uri,
          uploadData: uploadData
        });
        
        formData.append('files', fileObject as any);
      }
      
      console.log('📤 Uploading to PropelDB:', {
        customerNumber: uploadData.customerNumber,
        documentType: uploadData.documentType,
        documentNumber: uploadData.documentNumber,
        fileCount: uploadData.files.length,
        url: url
      });
      
      // Make the API call
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          // // 'Accept': 'application/json',
          // "Content-Type": "multipart/form-data"
          // // Don't set Content-Type header - let fetch set it with boundary for FormData
        }
      });

      const result = await response.json();
      console.log('📥 PropelDB API response:', result);
  
      if (result?.Response) {
        return ({ 
          success: true,
          data: result.Response
        });
      } else {
        console.warn('⚠️ PropelDB API response missing expected data:', result.Response);
        return ({
          success: false, 
          error: 'PropelDB API request failed - invalid response format',
        });
      }
      
    } catch (error) {
      console.error('❌ Error posting to PropelDB:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PropelDB API call failed'
      };
    }
  }

  /**
   * Convert base64 string to Blob for file upload
   * Note: In React Native, we'll use the base64 string directly in FormData
   */
  private async base64ToBlob(base64: string, _type: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
      
      // For React Native, we'll return the base64 string directly
      // FormData in React Native can handle base64 strings
      return base64Data;
    } catch (error) {
      console.error('❌ Error processing base64 data:', error);
      throw new Error('Failed to process base64 data');
    }
  }

  /**
   * Update SharePoint transaction status
   */
  private async updateTransactionSharePointStatus(mobileTransactionId: number, status: string): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(
        LOAD_TO_DOCK_QUERIES.UPDATE_LOAD_TO_DOCK_TRANSACTION_SHAREPOINT_STATUS,
        [status, mobileTransactionId.toString(), new Date().toISOString(), mobileTransactionId]
      );
    } catch (error) {
      console.error('❌ Error updating SharePoint transaction status:', error);
      throw error;
    }
  }

  /**
   * Update transaction status in database
   */
  private async updateTransactionStatus(response: IUploadDocumentResponse[]): Promise<void> {
    try {
      const promises = [];
      
      for (let i = 0; i < response.length; i++) {
        const element = response[i];
        const mobileTransactionId = element.MobileTransactionId;
        // Determine sync status based on ReturnStatus
        let syncStatus = 'pending';
        let syncMessage = element.ReturnMessage || '';
        
          if (element.ReturnStatus.toLowerCase() === 'e') {
            syncStatus = 'failed';
            syncMessage = element.ReturnMessage || 'Transaction failed';
          } else if (element.ReturnStatus.toLowerCase() === 's') {
            syncStatus = 'success';
            syncMessage = element.ReturnMessage || 'Transaction completed successfully';
          }
        
        // Create update promise for each transaction
        const updatePromise = simpleDatabaseService.executeQuery(
          LOAD_TO_DOCK_QUERIES.UPDATE_TRANSACTION_STATUS, 
          [
            syncStatus,
            syncMessage,
            new Date().toISOString(),
            mobileTransactionId
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

  /**
   * Get all transactions for transaction history (delegated to transaction history service)
   */
  async getAllTransactions(): Promise<ILoadToDockTransactionRequest[]> {
    try {
      const transactions = await transactionHistoryService.getAllTransactions();
      return transactions.map(transaction => ({
        MobileTransactionId: parseInt(transaction.MobileTransactionId, 10),
        TransactionDate: transaction.TransactionDate,
        DeliveryLineId: transaction.DeliveryLineId,
        VehicleNumber: transaction.VehicleNumber,
        DockDoor: transaction.DockDoor,
        LpnNumber: transaction.LpnNumber,
        InventoryOrgId: transaction.InventoryOrgId,
        UserId: transaction.UserId,
        ResponsibilityId: transaction.ResponsibilityId,
        ItemsData: transaction.ItemsData,
        EBSTransactionStatus: transaction.EBSTransactionStatus,
        sharePointTransactionStatus: transaction.sharePointTransactionStatus,
        CreatedAt: transaction.CreatedAt,
        Message: transaction.Message || ''
      }));
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw new Error('Failed to fetch transaction history');
    }
  }

  /**
   * Get transactions by status (delegated to transaction history service)
   */
  async getTransactionsByStatus(status: 'pending' | 'success' | 'failed'): Promise<ILoadToDockTransactionRequest[]> {
    try {
      const transactions = await transactionHistoryService.getTransactionsByStatus(status);
      return transactions.map(transaction => ({
        MobileTransactionId: parseInt(transaction.MobileTransactionId, 10),
        TransactionDate: transaction.TransactionDate,
        DeliveryLineId: transaction.DeliveryLineId,
        VehicleNumber: transaction.VehicleNumber,
        DockDoor: transaction.DockDoor,
        LpnNumber: transaction.LpnNumber,
        InventoryOrgId: transaction.InventoryOrgId,
        UserId: transaction.UserId,
        ResponsibilityId: transaction.ResponsibilityId,
        ItemsData: transaction.ItemsData,
        EBSTransactionStatus: transaction.EBSTransactionStatus,
        sharePointTransactionStatus: transaction.sharePointTransactionStatus,
        CreatedAt: transaction.CreatedAt,
        Message: transaction.Message || ''
      }));
    } catch (error) {
      console.error('Error fetching transactions by status:', error);
      throw new Error('Failed to fetch transactions by status');
    }
  }

  /**
   * Get paginated transactions (delegated to transaction history service)
   */
  async getTransactionsPaginated(page: number, pageSize: number): Promise<ILoadToDockTransactionRequest[]> {
    try {
      const result = await transactionHistoryService.getTransactionsPaginated(page, pageSize);
      return result.transactions.map(transaction => ({
        MobileTransactionId: parseInt(transaction.MobileTransactionId, 10),
        TransactionDate: transaction.TransactionDate,
        DeliveryLineId: transaction.DeliveryLineId,
        VehicleNumber: transaction.VehicleNumber,
        DockDoor: transaction.DockDoor,
        LpnNumber: transaction.LpnNumber,
        InventoryOrgId: transaction.InventoryOrgId,
        UserId: transaction.UserId,
        ResponsibilityId: transaction.ResponsibilityId,
        ItemsData: transaction.ItemsData,
        EBSTransactionStatus: transaction.EBSTransactionStatus,
        sharePointTransactionStatus: transaction.sharePointTransactionStatus,
        CreatedAt: transaction.CreatedAt,
        Message: transaction.Message || ''
      }));
    } catch (error) {
      console.error('Error fetching paginated transactions:', error);
      throw new Error('Failed to fetch paginated transactions');
    }
  }

}

export const loadToDockService = new LoadToDockService();
