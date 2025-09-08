import { RESPONSIBILITIES } from "../config";
import { loadToDockService } from "./loadToDockService";
import { networkService } from "./networkService";



class RealTimeSyncTransactionService {
    
     /**
   * Sync individual transaction based on responsibility
   */
 async syncTransaction(responsibility: string): Promise<{ success: boolean; error?: string; offline?: boolean }> {
    try {

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

      // Route to appropriate sync method based on responsibility
      switch (responsibility) {
        case RESPONSIBILITIES.LOAD_TO_DOCK:
          return await loadToDockService.processOnlineLoadToDock();
        default:
          return ({
            success: false,
            error: 'Invalid responsibility'
          });
      }
    } catch (error) {
      console.error('Error syncing transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction sync failed'
      };
    }
  }
}


export const realTimeSyncTransactionService = new RealTimeSyncTransactionService();