import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useSortAndFilter } from '../hooks/useSortAndFilter';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { getSortOptions, getFilterOptions } from '../constants/sortFilterOptions';
import { useResponsive } from '../hooks/useResponsive';
import { BUSINESS_CONFIG } from '../config';
import { createLoadToDockListStyles } from '../styles/LoadToDockListScreen.styles';

interface LoadToDockListScreenProps {
  navigation: any;
}

const LoadToDockListScreen: React.FC<LoadToDockListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showSortFilterModal, setShowSortFilterModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const { showError } = useAttractiveNotification();
  const { headerButtonSpacing } = useResponsive();
  const theme = useTheme();
  
  // Device size detection for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  
  const styles = createLoadToDockListStyles(theme, isTablet, isDesktop);

  // Sort and filter hook
  const {
    sortAndFilterState,
    filteredAndSortedData,
    updateSortAndFilter,
    hasActiveFilters,
  } = useSortAndFilter([]);

  // Infinite scroll hook for main data
  const {
    data: loadToDockItems,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    reset
  } = useInfiniteScroll({
    pageSize: BUSINESS_CONFIG.PAGINATION.LOAD_TO_DOCK_PAGE_SIZE,
    onLoadMore: useCallback(async (page: number, pageSize: number) => {
      if (searchQuery.trim()) {
        return await loadToDockService.searchLoadToDockItemsPaginated(searchQuery, page, pageSize);
      } else {
        return await loadToDockService.getLoadToDockItemsPaginated(page, pageSize);
      }
    }, [searchQuery]),
    onError: useCallback((error: Error) => {
      Alert.alert('Error', `Failed to load data: ${error.message}`);
    }, [])
  });

  // Store refresh function in ref to avoid dependency issues
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  // Reset and refresh data when search query changes
  useEffect(() => {
    reset();
    if (!searchQuery.trim()) {
      refresh();
    } else {
      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        refresh();
      }, BUSINESS_CONFIG.PAGINATION.LOAD_TO_DOCK_SEARCH_DEBOUNCE_MS);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, reset, refresh]);

  // Initial load when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshRef.current();
    }, 100); // Small delay to ensure proper initialization
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once on mount

  const handleToggleSearch = useCallback(() => {
    setIsSearchEnabled(prev => !prev);
    // Clear search query when disabling search
    if (isSearchEnabled) {
      setSearchQuery('');
    }
  }, [isSearchEnabled]);

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
      Alert.alert('Refresh', 'Refreshing data from SHIP_CONFIRM APIs...');
      // TODO: Call SHIP_CONFIRM responsibility APIs here
      // For now, just refresh the data
      await refresh();
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

  // Get the data to display (either filtered/sorted or original)
  const displayData = hasActiveFilters ? filteredAndSortedData : loadToDockItems;

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

  // Header right elements with refresh and three-dot menu
  const headerRightElement = (
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
  );

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
