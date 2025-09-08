import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderButton, SearchBar, StatusFilter, SyncButton, TransactionBanner, TransactionCard } from '../components';
import { AppHeader } from '../components/AppHeader';
import { TransactionStatus } from '../components/StatusFilter';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactionBanner } from '../hooks/useTransactionBanner';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { useTransactionSync } from '../hooks/useTransactionSync';
import { TransactionHistoryItem } from '../services/transactionHistoryService';
import { createTransactionHistoryScreenStyles } from '../styles/TransactionHistoryScreen.styles';

interface TransactionHistoryScreenProps {
  navigation: any;
}

const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus>('all');
  
  const { showError } = useAttractiveNotification();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Device size detection for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  
  const styles = createTransactionHistoryScreenStyles(theme, isTablet, isDesktop);

  // Transaction banner management
  const {
    bannerState,
    hideBanner,
  } = useTransactionBanner({
    autoHide: true,
    autoHideDelay: 3000,
    showProgress: true,
  });

  // Transaction sync management
  const {
    isSyncing,
    hasPendingTransactions,
    pendingCount,
    syncAllPendingTransactions,
    refreshPendingStatus,
    syncError,
    clearSyncError,
  } = useTransactionSync();

  // Use the custom hook for transaction history management
  const {
    filteredTransactions,
    stats,
    isLoading,
    isRefreshing,
    error,
    searchTerm,
    refreshTransactions,
    filterTransactions,
    searchTransactions,
    clearError
  } = useTransactionHistory({
    autoLoad: true,
    initialFilter: { status: 'all' },
    pageSize: isTablet ? 30 : 20
  });

  // Handle errors from the hook
  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  // Handle sync errors
  useEffect(() => {
    if (syncError) {
      showError('Sync Error', syncError);
      clearSyncError();
    }
  }, [syncError, showError, clearSyncError]);

  // Memoized handlers for performance
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      refreshTransactions(),
      refreshPendingStatus()
    ]);
  }, [refreshTransactions, refreshPendingStatus]);

  const handleStatusFilter = useCallback(async (status: TransactionStatus) => {
    setSelectedStatus(status);
    await filterTransactions({ status: status === 'all' ? undefined : status });
  }, [filterTransactions]);

  const handleSearch = useCallback(async (searchText: string) => {
    await searchTransactions(searchText);
  }, [searchTransactions]);

  const handleTransactionPress = useCallback((transaction: TransactionHistoryItem) => {
    // Navigate to transaction details if needed
    console.log('Transaction pressed:', transaction.MobileTransactionId);
  }, []);

  const handleDismissBanner = useCallback(() => {
    hideBanner();
  }, [hideBanner]);

  // Memoized empty state
  const renderEmptyState = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Transactions Found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedStatus === 'all' 
          ? 'No transactions have been recorded yet.'
          : `No ${selectedStatus} transactions found.`
        }
      </Text>
    </View>
  ), [selectedStatus, styles]);

  // Memoized loading state
  const renderLoadingState = useMemo(() => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading transactions...</Text>
    </View>
  ), [styles]);

  // Memoized transaction list
  const renderTransactionList = useMemo(() => {
    if (isLoading) {
      return renderLoadingState;
    }

    if (filteredTransactions.length === 0) {
      return renderEmptyState;
    }

    return filteredTransactions.map((transaction, index) => (
      <TransactionCard
        key={`${transaction.MobileTransactionId}-${index}`}
        transaction={transaction}
        theme={theme}
        isTablet={isTablet}
        isDesktop={isDesktop}
        onPress={handleTransactionPress}
        testID={`transaction-${transaction.MobileTransactionId}`}
      />
    ));
  }, [
    isLoading, 
    filteredTransactions, 
    renderLoadingState, 
    renderEmptyState, 
    theme, 
    isTablet, 
    isDesktop, 
    handleTransactionPress
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={theme.isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.primary} 
      />
      
      {/* Transaction Banner */}
      <TransactionBanner
        visible={bannerState.visible}
        status={bannerState.status}
        message={bannerState.message}
        showProgress={bannerState.showProgress}
        progress={bannerState.progress}
        autoHide={bannerState.autoHide}
        autoHideDelay={bannerState.autoHideDelay}
        onDismiss={handleDismissBanner}
        testID="transaction-history-banner"
      />
      
      {/* Header */}
      <AppHeader 
        title="Transaction History" 
        leftElement={
          <HeaderButton
            icon="back"
            onPress={() => navigation.goBack()}
          />
        }
        rightElement={
          hasPendingTransactions ? (
            <SyncButton
              onPress={syncAllPendingTransactions}
              isSyncing={isSyncing}
              pendingCount={pendingCount}
              testID="transaction-sync-button"
            />
          ) : null
        }
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchTerm}
          onChangeText={handleSearch}
          placeholder="Search transactions..."
        />
      </View>

      {/* Status Filter */}
      <StatusFilter
        selectedStatus={selectedStatus}
        stats={stats}
        theme={theme}
        isTablet={isTablet}
        isDesktop={isDesktop}
        onStatusChange={handleStatusFilter}
        testID="status-filter"
      />

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
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        testID="transactions-scroll-view"
      >
        {renderTransactionList}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;