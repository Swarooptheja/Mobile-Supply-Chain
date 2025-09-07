import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { HeaderButton } from '../components';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { createTransactionHistoryScreenStyles } from '../styles/TransactionHistoryScreen.styles';

interface TransactionHistoryScreenProps {
  navigation: any;
}

type TransactionStatus = 'pending' | 'success' | 'failed' | 'all';

const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus>('all');
  
  const { showError } = useAttractiveNotification();
  const theme = useTheme();
  const styles = createTransactionHistoryScreenStyles(theme);
  const insets = useSafeAreaInsets();

  // Use the custom hook for transaction history management
  const {
    transactions,
    filteredTransactions,
    stats,
    isLoading,
    isRefreshing,
    error,
    refreshTransactions,
    filterTransactions,
    clearError
  } = useTransactionHistory({
    autoLoad: true,
    initialFilter: { status: 'all' },
    pageSize: 50
  });

  // Handle errors from the hook
  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleRefresh = async () => {
    await refreshTransactions();
  };

  const handleStatusFilter = async (status: TransactionStatus) => {
    setSelectedStatus(status);
    await filterTransactions({ status: status === 'all' ? undefined : status });
  };

  const getStatusCount = (status: TransactionStatus): number => {
    if (!stats) return 0;
    
    switch (status) {
      case 'all':
        return stats.total;
      case 'pending':
        return stats.pending;
      case 'success':
        return stats.success;
      case 'failed':
        return stats.failed;
      default:
        return 0;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
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
  };

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {[
          { key: 'all', label: 'All', count: getStatusCount('all') },
          { key: 'pending', label: 'Pending', count: getStatusCount('pending') },
          { key: 'success', label: 'Success', count: getStatusCount('success') },
          { key: 'failed', label: 'Failed', count: getStatusCount('failed') }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedStatus === filter.key && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilter(filter.key as TransactionStatus)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterButtonText,
              selectedStatus === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              selectedStatus === filter.key && styles.filterBadgeActive
            ]}>
              <Text style={[
                styles.filterBadgeText,
                selectedStatus === filter.key && styles.filterBadgeTextActive
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTransactionCard = useCallback((transaction: any, index: number) => {
    const status = transaction.sharePointTransactionStatus;
    const isPending = status === 'pending';
    const isSuccess = status === 'success';
    const isFailed = status === 'failed';

    return (
      <View key={`${transaction.MobileTransactionId}-${index}`} style={styles.transactionCard}>
        {/* Header with status */}
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionId}>
              ID: {transaction.MobileTransactionId}
            </Text>
            <Text style={styles.transactionTimestamp}>
              {formatTimestamp(transaction.CreatedAt)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            isPending && styles.statusBadgePending,
            isSuccess && styles.statusBadgeSuccess,
            isFailed && styles.statusBadgeFailed
          ]}>
            <Text style={[
              styles.statusText,
              isPending && styles.statusTextPending,
              isSuccess && styles.statusTextSuccess,
              isFailed && styles.statusTextFailed
            ]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery ID:</Text>
            <Text style={styles.detailValue}>{transaction.DeliveryLineId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle Number:</Text>
            <Text style={styles.detailValue}>{transaction.VehicleNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dock Door:</Text>
            <Text style={styles.detailValue}>{transaction.DockDoor}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>LPN Number:</Text>
            <Text style={styles.detailValue}>{transaction.LpnNumber}</Text>
          </View>
        </View>

        {/* Status-specific content */}
        {isPending && (
          <View style={styles.pendingContainer}>
            <View style={styles.pendingIndicator}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>Transaction is being processed...</Text>
            </View>
          </View>
        )}

        {isSuccess && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✓ Transaction completed successfully</Text>
            {transaction.Message && (
              <Text style={styles.messageText}>{transaction.Message}</Text>
            )}
          </View>
        )}

        {isFailed && (
          <View style={styles.failedContainer}>
            <Text style={styles.failedText}>✗ Transaction failed</Text>
            {transaction.Message && (
              <Text style={styles.errorMessageText}>{transaction.Message}</Text>
            )}
          </View>
        )}
      </View>
    );
  }, [styles]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Transactions Found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedStatus === 'all' 
          ? 'No transactions have been recorded yet.'
          : `No ${selectedStatus} transactions found.`
        }
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading transactions...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <AppHeader 
        title="Transaction History" 
        leftElement={
          <HeaderButton
            icon="back"
            onPress={() => navigation.goBack()}
          />
        }
      />

      {/* Status Filter */}
      {renderStatusFilter()}

      {/* Transactions List */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(20, insets.bottom + 20) }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#1e3a8a']}
            tintColor="#1e3a8a"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          renderLoadingState()
        ) : filteredTransactions.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredTransactions.map((transaction, index) => 
            renderTransactionCard(transaction, index)
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;