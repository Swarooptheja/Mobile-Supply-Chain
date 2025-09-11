import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { HeaderButton } from '../components';
import { AppHeader } from '../components/AppHeader';
import { SearchBar, BarcodeInputField } from '../components';
import InfiniteScrollList from '../components/InfiniteScrollList';
import LoadToDockItem from '../components/LoadToDockItem';
import BarcodeScanner from '../components/BarcodeScanner';
import SortAndFilter from '../components/SortAndFilter';
import { ScanButton } from '../components';
import { ILoadToDockItem } from '../types/loadToDock.interface';
import { loadToDockService } from '../services/loadToDockService';
import { useLoadToDockSearch } from '../hooks/useLoadToDockSearch';
import { useSortAndFilter } from '../hooks/useSortAndFilter';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { getSortOptions, getFilterOptions } from '../constants/sortFilterOptions';
import { useResponsive } from '../hooks/useResponsive';
import { BUSINESS_CONFIG } from '../config';
import { createLoadToDockListStyles } from '../styles/LoadToDockListScreen.styles';
import { useLoadToDockRefresh } from '../hooks/useLoadToDockRefresh';
import { RefreshProgressIndicator } from '../components/RefreshProgressIndicator';

interface LoadToDockListScreenProps {
  navigation: any;
}

const LoadToDockListScreen: React.FC<LoadToDockListScreenProps> = ({ navigation }) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showSortFilterModal, setShowSortFilterModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const { showError } = useAttractiveNotification();
  const { headerButtonSpacing } = useResponsive();
  const theme = useTheme();
  
  // Use optimized search hook
  const {
    searchQuery,
    setSearchQuery,
    data: loadToDockItems,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    reset
  } = useLoadToDockSearch();
  
  // Add the new refresh hook
  const {
    isRefreshing,
    refreshProgress,
    refreshShipConfirmData,
    cancelRefresh
  } = useLoadToDockRefresh();
  
  // Device size detection for responsive design - memoized to prevent recalculation
  const deviceInfo = useMemo(() => {
    const { width: screenWidth } = Dimensions.get('window');
    return {
      isTablet: screenWidth > 768 && screenWidth <= 1024,
      isDesktop: screenWidth > 1024,
    };
  }, []);
  
  const styles = useMemo(() => 
    createLoadToDockListStyles(theme, deviceInfo.isTablet, deviceInfo.isDesktop),
    [theme, deviceInfo.isTablet, deviceInfo.isDesktop]
  );

  // Sort and filter hook
  const {
    sortAndFilterState,
    filteredAndSortedData,
    updateSortAndFilter,
    hasActiveFilters,
  } = useSortAndFilter([]);

  const handleToggleSearch = useCallback(() => {
    setIsSearchEnabled(prev => !prev);
    // Clear search query when disabling search
    if (isSearchEnabled) {
      setSearchQuery('');
    }
  }, [isSearchEnabled, setSearchQuery]);

  const handleScanDeliveryId = async () => {
    try {
      setShowBarcodeScanner(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to open barcode scanner');
    }
  };

  const handleBarcodeScanned = useCallback(async (barcode: string) => {
    try {
      // Search for the barcode in SQLite database
      const searchResults = await loadToDockService.searchByBarcode(barcode);
      if (searchResults && searchResults.length) {
        // Found matching records, navigate to Items Page with the first result
        const matchedItem = searchResults[0];
        // Clear the input field before navigation
        setBarcodeInput('');
        navigation.navigate('LoadToDockItems', { deliveryItem: matchedItem });
      } else {
        // No match found, show error and clear input
        showError('No Match Found', `No delivery items found for barcode: ${barcode}`);
        setBarcodeInput('');
      }
    } catch (error) {
      // Error occurred, show error and clear input
      showError('Error', 'Failed to search for barcode in database');
      setBarcodeInput('');
    }
  }, [navigation, showError]);

  const handleBarcodeInputChange = useCallback((text: string) => {
    setBarcodeInput(text);
  }, []);

  const handleBarcodeInputScanned = useCallback(async (barcode: string) => {
    // This is called when the BarcodeInputField detects a scanned barcode
    await handleBarcodeScanned(barcode);
  }, [handleBarcodeScanned]);

  const handleScanComplete = useCallback(() => {
    // This is called after the barcode scan is complete (success or failure)
    // The input field will be cleared automatically by the BarcodeInputField component
  }, []);

  const handleRefreshData = async () => {
    try {
      // Show progress alert with cancel option
      // Alert.alert(
      //   'Refreshing Data', 
      //   'Refreshing data from SHIP_CONFIRM APIs...',
      //   [
      //     {
      //       text: 'Cancel',
      //       onPress: cancelRefresh,
      //       style: 'cancel'
      //     }
      //   ]
      // );
      
      // Call the refresh service
      await refreshShipConfirmData();
      
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    }
  };

  const handleLoadToDockPress = useCallback(async (item: ILoadToDockItem) => {
    try {
      // Navigate to Load to Dock Items Page
      navigation.navigate('LoadToDockItems', { deliveryItem: item });
    } catch (error) {
      Alert.alert('Error', 'Failed to navigate to items page');
    }
  }, [navigation]);

  const handleSortAndFilter = useCallback(async (sortBy: string | null, filters: string[]) => {
    try {
      updateSortAndFilter(sortBy, filters);
      // TODO: Apply sorting and filtering to the current data
      // The hook will handle the data transformation
    } catch (error) {
      Alert.alert('Error', 'Failed to apply sort and filter');
    }
  }, [updateSortAndFilter]);

  // Get the data to display (either filtered/sorted or original) - memoized
  const displayData = useMemo(() => 
    hasActiveFilters ? filteredAndSortedData : loadToDockItems,
    [hasActiveFilters, filteredAndSortedData, loadToDockItems]
  );

  const handleBackToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const renderLoadToDockItem = useCallback((item: ILoadToDockItem, index: number) => (
    <LoadToDockItem
      key={`${item.deliveryId}-${index}`}
      item={item}
      index={index}
      onPress={handleLoadToDockPress}
    />
  ), [handleLoadToDockPress]);

  const keyExtractor = useCallback((item: ILoadToDockItem, index: number) => 
    `${item.deliveryId}-${index}`, []
  );

  // Header right elements with refresh and three-dot menu - memoized
  const headerRightElement = useMemo(() => (
    <View style={[styles.headerRightContainer, { gap: headerButtonSpacing }]}>
      <HeaderButton
        icon="refresh"
        onPress={handleRefreshData}
      />
      <HeaderButton
        icon="more"
        onPress={() => setShowSortFilterModal(true)}
      />
    </View>
  ), [styles.headerRightContainer, headerButtonSpacing, handleRefreshData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={theme.colors.background === '#121212' ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.primary} 
      />
      
      {/* Header */}
      <AppHeader 
        title="Deliveries"
        leftElement={
          <HeaderButton
            icon="back"
            onPress={handleBackToDashboard}
          />
        }
        rightElement={headerRightElement}
      />

      {/* Refresh Progress Indicator */}
      <RefreshProgressIndicator 
        progress={refreshProgress}
        visible={isRefreshing}
        showDetails={true}
      />

      {/* Barcode Input and Search Section */}
      <View style={styles.barcodeSection}>
        <View style={styles.barcodeInputContainer}>
          <BarcodeInputField
            value={barcodeInput}
            onChangeText={handleBarcodeInputChange}
            onBarcodeScanned={handleBarcodeInputScanned}
            onScanComplete={handleScanComplete}
            placeholder="Scan or enter barcode"
            autoFocus={true}
            label="Barcode Scanner"
          />
          <HeaderButton
            icon={"search"}
            onPress={handleToggleSearch}
            style={StyleSheet.flatten([
              styles.searchButton,
              isSearchEnabled && styles.searchButtonActive
            ])}
          />
        </View>
      </View>

      {/* Search Bar Section - Only shown when search is enabled */}
      {isSearchEnabled && (
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder="Search deliveries"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>
          <ScanButton onPress={handleScanDeliveryId} />
        </View>
      )}

      {/* Load to Dock Items List with Infinite Scroll */}
      <View style={styles.contentSection}>
        <InfiniteScrollList
          data={displayData}
          renderItem={renderLoadToDockItem}
          onLoadMore={loadMore}
          onRefresh={refresh}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.itemsListContent}
          style={styles.itemsList}
          onEndReachedThreshold={0.2}
        />
      </View>

      {/* Sort & Filter Modal */}
      <SortAndFilter
        visible={showSortFilterModal}
        onClose={() => setShowSortFilterModal(false)}
        onApply={handleSortAndFilter}
        sortOptions={getSortOptions('load-to-dock')}
        filterOptions={getFilterOptions('load-to-dock')}
        currentSort={sortAndFilterState.sortBy}
        currentFilters={sortAndFilterState.filters}
        title="Sort & Filter Load to Dock"
      />

      {/* Barcode Scanner */}
      <BarcodeScanner
        visible={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </SafeAreaView>
  );
};


export default LoadToDockListScreen;
