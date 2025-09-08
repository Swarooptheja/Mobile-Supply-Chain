import { getDataFromResultSet } from '../../services/sharedService';
import { TRANSACTION_HISTORY_QUERIES } from '../constants/queries';
import { ILoadToDockTransactionRequest } from '../types/loadToDock.interface';
import { simpleDatabaseService } from './simpleDatabase';

// Transaction History specific interfaces
export interface TransactionHistoryItem {
  MobileTransactionId: string;
  TransactionDate: string;
  DeliveryLineId: string;
  VehicleNumber: string;
  DockDoor: string;
  LpnNumber: string;
  InventoryOrgId: string;
  UserId: string;
  ResponsibilityId: string;
  ItemsData: string;
  EBSTransactionStatus: 'pending' | 'success' | 'failed';
  sharePointTransactionStatus: 'pending' | 'success' | 'failed';
  CreatedAt: string;
  Message?: string;
}

export interface TransactionHistoryFilter {
  status?: 'pending' | 'success' | 'failed' | 'all';
  dateFrom?: string;
  dateTo?: string;
  deliveryId?: string;
  vehicleNumber?: string;
  userId?: string;
}

export interface TransactionHistoryStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  lastUpdated: string;
}

export interface PaginatedTransactionResult {
  transactions: TransactionHistoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

class TransactionHistoryService {
  /**
   * Get all transaction history records
   */
  async getAllTransactions(): Promise<TransactionHistoryItem[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_ALL_TRANSACTIONS);
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw new Error('Failed to fetch transaction history');
    }
  }

  /**
   * Get transactions by status
   */
  async getTransactionsByStatus(status: 'pending' | 'success' | 'failed'): Promise<TransactionHistoryItem[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_TRANSACTIONS_BY_STATUS, [status]);
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error fetching transactions by status:', error);
      throw new Error('Failed to fetch transactions by status');
    }
  }

  /**
   * Get paginated transactions
   */
  async getTransactionsPaginated(page: number, pageSize: number): Promise<PaginatedTransactionResult> {
    try {
      const offset = (page - 1) * pageSize;
      
      // Get total count
      const countResult = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_TRANSACTIONS_COUNT);
      const totalCount = getDataFromResultSet(countResult)[0]?.count || 0;
      
      // Get paginated data
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_TRANSACTIONS_PAGINATED, [pageSize, offset]);
      const transactions = getDataFromResultSet(result);
      
      const totalPages = Math.ceil(totalCount / pageSize);
      
      return {
        transactions: this.mapToTransactionHistoryItems(transactions),
        totalCount,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error('Error fetching paginated transactions:', error);
      throw new Error('Failed to fetch paginated transactions');
    }
  }

  /**
   * Get transactions with advanced filtering
   */
  async getTransactionsWithFilter(filter: TransactionHistoryFilter): Promise<TransactionHistoryItem[]> {
    try {
      let query = TRANSACTION_HISTORY_QUERIES.GET_ALL_TRANSACTIONS;
      const params: any[] = [];
      const conditions: string[] = [];

      // Add status filter
      if (filter.status && filter.status !== 'all') {
        conditions.push('sharePointTransactionStatus = ?');
        params.push(filter.status);
      }

      // Add date range filter
      if (filter.dateFrom) {
        conditions.push('CreatedAt >= ?');
        params.push(filter.dateFrom);
      }

      if (filter.dateTo) {
        conditions.push('CreatedAt <= ?');
        params.push(filter.dateTo);
      }

      // Add delivery ID filter
      if (filter.deliveryId) {
        conditions.push('DeliveryLineId LIKE ?');
        params.push(`%${filter.deliveryId}%`);
      }

      // Add vehicle number filter
      if (filter.vehicleNumber) {
        conditions.push('VehicleNumber LIKE ?');
        params.push(`%${filter.vehicleNumber}%`);
      }

      // Add user ID filter
      if (filter.userId) {
        conditions.push('UserId = ?');
        params.push(filter.userId);
      }

      // Build final query
      if (conditions.length > 0) {
        query = query.replace('ORDER BY CreatedAt DESC', `WHERE ${conditions.join(' AND ')} ORDER BY CreatedAt DESC`);
      }

      const result = await simpleDatabaseService.executeQuery(query, params);
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error fetching filtered transactions:', error);
      throw new Error('Failed to fetch filtered transactions');
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<TransactionHistoryStats> {
    try {
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_TRANSACTION_STATS);
      const stats = getDataFromResultSet(result)[0];
      
      // Debug logging to help identify count issues
      if (__DEV__) {
        console.log('TransactionHistoryService - Raw stats from DB:', stats);
        console.log('TransactionHistoryService - Query used:', TRANSACTION_HISTORY_QUERIES.GET_TRANSACTION_STATS);
      }
      
      const processedStats = {
        total: stats?.total || 0,
        pending: stats?.pending || 0,
        success: stats?.success || 0,
        failed: stats?.failed || 0,
        lastUpdated: new Date().toISOString()
      };
      
      if (__DEV__) {
        console.log('TransactionHistoryService - Processed stats:', processedStats);
      }
      
      return processedStats;
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw new Error('Failed to fetch transaction statistics');
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<TransactionHistoryItem | null> {
    try {
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_TRANSACTION_BY_ID, [transactionId]);
      const transactions = getDataFromResultSet(result);
      
      if (transactions.length === 0) {
        return null;
      }
      
      return this.mapToTransactionHistoryItems(transactions)[0];
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      throw new Error('Failed to fetch transaction details');
    }
  }

  /**
   * Get recent transactions (last N days)
   */
  async getRecentTransactions(days: number = 7): Promise<TransactionHistoryItem[]> {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);
      const dateFromString = dateFrom.toISOString();
      
      const result = await simpleDatabaseService.executeQuery(
        TRANSACTION_HISTORY_QUERIES.GET_RECENT_TRANSACTIONS, 
        [dateFromString]
      );
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      throw new Error('Failed to fetch recent transactions');
    }
  }

  /**
   * Get transactions by date range
   */
  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionHistoryItem[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(
        TRANSACTION_HISTORY_QUERIES.GET_TRANSACTIONS_BY_DATE_RANGE, 
        [startDate, endDate]
      );
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw new Error('Failed to fetch transactions by date range');
    }
  }

  /**
   * Search transactions by text
   */
  async searchTransactions(searchTerm: string): Promise<TransactionHistoryItem[]> {
    try {
      const searchPattern = `%${searchTerm}%`;
      const result = await simpleDatabaseService.executeQuery(
        TRANSACTION_HISTORY_QUERIES.SEARCH_TRANSACTIONS, 
        [searchPattern, searchPattern, searchPattern, searchPattern]
      );
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error searching transactions:', error);
      throw new Error('Failed to search transactions');
    }
  }

  /**
   * Get pending transactions for retry
   */
  async getPendingTransactions(): Promise<TransactionHistoryItem[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_PENDING_TRANSACTIONS);
      const transactions = getDataFromResultSet(result);
      return this.mapToTransactionHistoryItems(transactions);
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      throw new Error('Failed to fetch pending transactions');
    }
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(transactionId: string, status: 'pending' | 'success' | 'failed', message?: string): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(
        TRANSACTION_HISTORY_QUERIES.UPDATE_TRANSACTION_STATUS, 
        [status, message || '', new Date().toISOString(), transactionId]
      );
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw new Error('Failed to update transaction status');
    }
  }

  /**
   * Delete transaction (for cleanup purposes)
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.DELETE_TRANSACTION, [transactionId]);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

  /**
   * Get transaction count by status
   */
  async getTransactionCountByStatus(): Promise<{ status: string; count: number }[]> {
    try {
      const result = await simpleDatabaseService.executeQuery(TRANSACTION_HISTORY_QUERIES.GET_TRANSACTION_COUNT_BY_STATUS);
      return getDataFromResultSet(result);
    } catch (error) {
      console.error('Error fetching transaction count by status:', error);
      throw new Error('Failed to fetch transaction count by status');
    }
  }

  /**
   * Export transactions to CSV format
   */
  async exportTransactionsToCSV(filter?: TransactionHistoryFilter): Promise<string> {
    try {
      const transactions = filter 
        ? await this.getTransactionsWithFilter(filter)
        : await this.getAllTransactions();
      
      // CSV header
      const headers = [
        'Transaction ID',
        'Transaction Date',
        'Delivery Line ID',
        'Vehicle Number',
        'Dock Door',
        'LPN Number',
        'Status',
        'Message',
        'Created At'
      ];
      
      // CSV rows
      const rows = transactions.map(transaction => [
        transaction.MobileTransactionId,
        transaction.TransactionDate,
        transaction.DeliveryLineId,
        transaction.VehicleNumber,
        transaction.DockDoor,
        transaction.LpnNumber,
        transaction.sharePointTransactionStatus,
        transaction.Message || '',
        transaction.CreatedAt
      ]);
      
      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return csvContent;
    } catch (error) {
      console.error('Error exporting transactions to CSV:', error);
      throw new Error('Failed to export transactions');
    }
  }

  /**
   * Helper method to map database results to TransactionHistoryItem interface
   */
  private mapToTransactionHistoryItems(data: any[]): TransactionHistoryItem[] {
    return data.map(item => ({
      MobileTransactionId: item.MobileTransactionId,
      TransactionDate: item.TransactionDate,
      DeliveryLineId: item.DeliveryLineId,
      VehicleNumber: item.VehicleNumber,
      DockDoor: item.DockDoor,
      LpnNumber: item.LpnNumber,
      InventoryOrgId: item.InventoryOrgId,
      UserId: item.UserId,
      ResponsibilityId: item.ResponsibilityId,
      ItemsData: item.ItemsData,
      EBSTransactionStatus: item.EBSTransactionStatus,
      sharePointTransactionStatus: item.sharePointTransactionStatus,
      CreatedAt: item.CreatedAt,
      Message: item.Message
    }));
  }

  /**
   * Format transaction data for display
   */
  formatTransactionForDisplay(transaction: TransactionHistoryItem) {
    return {
      id: transaction.MobileTransactionId,
      timestamp: this.formatTimestamp(transaction.CreatedAt),
      status: transaction.sharePointTransactionStatus,
      deliveryId: transaction.DeliveryLineId,
      vehicleNumber: transaction.VehicleNumber,
      dockDoor: transaction.DockDoor,
      lpnNumber: transaction.LpnNumber,
      message: transaction.Message,
      isPending: transaction.sharePointTransactionStatus === 'pending',
      isSuccess: transaction.sharePointTransactionStatus === 'success',
      isFailed: transaction.sharePointTransactionStatus === 'failed'
    };
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  }
}

export const transactionHistoryService = new TransactionHistoryService();
