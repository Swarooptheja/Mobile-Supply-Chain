# 🔧 Transaction History Service - Dedicated Service Architecture

This document describes the dedicated Transaction History Service implementation, providing a reusable and maintainable architecture for transaction history management across the application.

## 🎯 Overview

The Transaction History Service is a dedicated service layer that handles all transaction history operations, providing a clean separation of concerns and reusability across different parts of the application.

## 🏗️ Architecture

### Core Components

#### 1. **TransactionHistoryService** (`src/services/transactionHistoryService.ts`)
- **Dedicated service** for all transaction history operations
- **Comprehensive CRUD operations** with advanced filtering
- **Statistics and analytics** functionality
- **Export capabilities** for data analysis
- **Type-safe interfaces** for better development experience

#### 2. **useTransactionHistory Hook** (`src/hooks/useTransactionHistory.ts`)
- **Custom React hook** for transaction history state management
- **Built-in pagination** and filtering logic
- **Error handling** and loading states
- **Real-time updates** and refresh capabilities
- **Optimized performance** with memoization

#### 3. **Dedicated Queries** (`src/constants/queries.ts`)
- **TRANSACTION_HISTORY_QUERIES** - Comprehensive SQL queries
- **Optimized database operations** for better performance
- **Advanced filtering** and search capabilities
- **Statistics queries** for analytics

## 📊 Service Interface

### TransactionHistoryService Methods

#### **Basic CRUD Operations**
```typescript
// Get all transactions
async getAllTransactions(): Promise<TransactionHistoryItem[]>

// Get transactions by status
async getTransactionsByStatus(status: 'pending' | 'success' | 'failed'): Promise<TransactionHistoryItem[]>

// Get paginated transactions
async getTransactionsPaginated(page: number, pageSize: number): Promise<PaginatedTransactionResult>

// Get transaction by ID
async getTransactionById(transactionId: string): Promise<TransactionHistoryItem | null>
```

#### **Advanced Filtering & Search**
```typescript
// Get transactions with advanced filtering
async getTransactionsWithFilter(filter: TransactionHistoryFilter): Promise<TransactionHistoryItem[]>

// Search transactions by text
async searchTransactions(searchTerm: string): Promise<TransactionHistoryItem[]>

// Get recent transactions
async getRecentTransactions(days: number = 7): Promise<TransactionHistoryItem[]>

// Get transactions by date range
async getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionHistoryItem[]>
```

#### **Statistics & Analytics**
```typescript
// Get transaction statistics
async getTransactionStats(): Promise<TransactionHistoryStats>

// Get transaction count by status
async getTransactionCountByStatus(): Promise<{ status: string; count: number }[]>
```

#### **Status Management**
```typescript
// Update transaction status
async updateTransactionStatus(transactionId: string, status: 'pending' | 'success' | 'failed', message?: string): Promise<void>

// Get pending transactions for retry
async getPendingTransactions(): Promise<TransactionHistoryItem[]>
```

#### **Export & Cleanup**
```typescript
// Export transactions to CSV
async exportTransactionsToCSV(filter?: TransactionHistoryFilter): Promise<string>

// Delete transaction
async deleteTransaction(transactionId: string): Promise<void>
```

## 🎣 Custom Hook Interface

### useTransactionHistory Hook

#### **State Management**
```typescript
const {
  // Data
  transactions: TransactionHistoryItem[],
  filteredTransactions: TransactionHistoryItem[],
  stats: TransactionHistoryStats | null,
  
  // Loading states
  isLoading: boolean,
  isRefreshing: boolean,
  isLoadingMore: boolean,
  
  // Pagination
  currentPage: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  totalCount: number,
  
  // Filtering
  currentFilter: TransactionHistoryFilter,
  
  // Error handling
  error: string | null
} = useTransactionHistory(options);
```

#### **Actions**
```typescript
const {
  // Data operations
  loadTransactions: () => Promise<void>,
  refreshTransactions: () => Promise<void>,
  loadMoreTransactions: () => Promise<void>,
  
  // Filtering & search
  filterTransactions: (filter: TransactionHistoryFilter) => Promise<void>,
  searchTransactions: (searchTerm: string) => Promise<void>,
  
  // Individual operations
  getTransactionById: (id: string) => Promise<TransactionHistoryItem | null>,
  updateTransactionStatus: (id: string, status: string, message?: string) => Promise<void>,
  
  // Export
  exportTransactions: (filter?: TransactionHistoryFilter) => Promise<string>,
  
  // Error handling
  clearError: () => void
} = useTransactionHistory(options);
```

## 🔧 Usage Examples

### Basic Usage in Components

```typescript
import { useTransactionHistory } from '../hooks/useTransactionHistory';

const MyComponent = () => {
  const {
    transactions,
    filteredTransactions,
    isLoading,
    error,
    refreshTransactions,
    filterTransactions
  } = useTransactionHistory({
    autoLoad: true,
    pageSize: 20
  });

  // Component logic...
};
```

### Advanced Filtering

```typescript
// Filter by status
await filterTransactions({ status: 'pending' });

// Filter by date range
await filterTransactions({
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31'
});

// Filter by multiple criteria
await filterTransactions({
  status: 'success',
  vehicleNumber: 'TRUCK001',
  userId: '1001'
});
```

### Search Functionality

```typescript
// Search transactions
await searchTransactions('TRUCK001');

// Clear search (load all)
await searchTransactions('');
```

### Export Data

```typescript
// Export all transactions
const csvData = await exportTransactions();

// Export filtered transactions
const csvData = await exportTransactions({
  status: 'failed',
  dateFrom: '2024-01-01'
});
```

### Direct Service Usage

```typescript
import { transactionHistoryService } from '../services/transactionHistoryService';

// Get statistics
const stats = await transactionHistoryService.getTransactionStats();

// Get recent transactions
const recent = await transactionHistoryService.getRecentTransactions(7);

// Update transaction status
await transactionHistoryService.updateTransactionStatus(
  '12345',
  'success',
  'Transaction completed successfully'
);
```

## 📊 Data Interfaces

### TransactionHistoryItem
```typescript
interface TransactionHistoryItem {
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
```

### TransactionHistoryFilter
```typescript
interface TransactionHistoryFilter {
  status?: 'pending' | 'success' | 'failed' | 'all';
  dateFrom?: string;
  dateTo?: string;
  deliveryId?: string;
  vehicleNumber?: string;
  userId?: string;
}
```

### TransactionHistoryStats
```typescript
interface TransactionHistoryStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  lastUpdated: string;
}
```

### PaginatedTransactionResult
```typescript
interface PaginatedTransactionResult {
  transactions: TransactionHistoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## 🎨 Integration with Existing Code

### Updated LoadToDockService
The LoadToDockService now delegates transaction history operations to the dedicated service:

```typescript
// Before: Direct database operations
async getAllTransactions(): Promise<ILoadToDockTransactionRequest[]> {
  const result = await simpleDatabaseService.executeQuery(LOAD_TO_DOCK_QUERIES.GET_ALL_TRANSACTIONS);
  return getDataFromResultSet(result);
}

// After: Delegated to dedicated service
async getAllTransactions(): Promise<ILoadToDockTransactionRequest[]> {
  const transactions = await transactionHistoryService.getAllTransactions();
  return transactions.map(transaction => ({
    // Map to LoadToDockTransactionRequest format
  }));
}
```

### Updated TransactionHistoryScreen
The screen now uses the custom hook for cleaner code:

```typescript
// Before: Manual state management
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(false);
// ... complex state management

// After: Custom hook
const {
  transactions,
  isLoading,
  refreshTransactions,
  filterTransactions
} = useTransactionHistory();
```

## 🚀 Benefits

### **Reusability**
- **Single source of truth** for transaction history operations
- **Consistent API** across different components
- **Easy to maintain** and update

### **Performance**
- **Optimized queries** with proper indexing
- **Pagination support** for large datasets
- **Memoized operations** in the custom hook

### **Developer Experience**
- **Type-safe interfaces** with TypeScript
- **Comprehensive error handling**
- **Built-in loading states** and error management

### **Scalability**
- **Modular architecture** for easy extension
- **Separation of concerns** between UI and business logic
- **Database abstraction** for future changes

## 🔄 Migration Guide

### From Direct Service Calls
```typescript
// Old way
const transactions = await loadToDockService.getAllTransactions();

// New way
const transactions = await transactionHistoryService.getAllTransactions();
```

### From Manual State Management
```typescript
// Old way
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(false);
// ... complex state management

// New way
const { transactions, isLoading } = useTransactionHistory();
```

## 📝 Best Practices

### **Service Usage**
- Use the dedicated service for all transaction history operations
- Leverage the custom hook for UI components
- Handle errors appropriately with the built-in error handling

### **Performance**
- Use pagination for large datasets
- Implement proper loading states
- Cache frequently accessed data

### **Error Handling**
- Always handle errors from service calls
- Use the built-in error handling from the custom hook
- Provide meaningful error messages to users

This dedicated service architecture provides a robust, scalable, and maintainable solution for transaction history management across the entire application.
