import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DeliveryDetailsCard,
  LoadToDockHeader,
  LoadToDockItemCard,
  SearchAndScanSection,
  VehicleInputSection
} from '../components';
import BarcodeScanner from '../components/BarcodeScanner';
import { Button } from '../components/Button';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useLoadToDockItems } from '../hooks/useLoadToDockItems';
import { useLoadToDockValidation } from '../hooks/useLoadToDockValidation';
import { useNavigationHandlers } from '../hooks/useNavigationHandlers';
import { useSearchWithDebounce } from '../hooks/useSearchWithDebounce';
import { loadToDockService, LoadToDockRequest } from '../services/loadToDockService';
import { createLoadToDockItemsScreenStyles } from '../styles/LoadToDockItemsScreen.styles';
import { ILoadToDockItemDetail, LoadToDockItemsScreenProps } from '../types/loadToDock.interface';
import { useAuth } from '../context/AuthContext';
import { LOGIN_QUERIES } from '../constants/queries';
import { simpleDatabaseService } from '../services/simpleDatabase';
import { getDataFromResultSet } from '../../services/sharedService';
import { RESPONSIBILITIES } from '../config/api';

const LoadToDockItemsScreen: React.FC<LoadToDockItemsScreenProps> = ({ route, navigation }) => {
  const { deliveryItem } = route.params;
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [vehicleInputFocused, setVehicleInputFocused] = useState(false);
  
  const { showError, showSuccess } = useAttractiveNotification();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { defaultOrgId } = useAuth();

  // Device size detection for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  
  const styles = createLoadToDockItemsScreenStyles(theme, isTablet, isDesktop);

  // Use custom hooks for data management
  const {
    items,
    filteredItems,
    isLoading,
    searchItems,
    updateItemMediaStatus,
    updateItemQuantity,
    getItemMediaStatus,
    scanItem,
  } = useLoadToDockItems({
    deliveryId: deliveryItem.deliveryId,
    onError: showError,
  });

  const canLoadToDock = useLoadToDockValidation(items, vehicleNumber);

  // Use debounced search
  useSearchWithDebounce({
    searchQuery,
    onSearch: searchItems,
  });

  // Navigation handlers
  const {
    navigateToItemDetails,
    handleBackToDashboard,
    createMediaSavedCallback,
  } = useNavigationHandlers({
    navigation,
    deliveryItem,
    updateItemMediaStatus,
    showSuccess,
    getItemMediaStatus,
  });



  const handleScanItem = () => {
    setIsScannerVisible(true);
  };

  const handleBarcodeScanned = useCallback(async (barcode: string) => {
    try {
      const searchResults = await scanItem(barcode);
      
      if (searchResults.length) {
        const scannedItem = searchResults[0];
        showSuccess('Item Found', `Scanned: ${barcode}`);
        
        // console.log('🎬 handleBarcodeScanned - Scanned item:', scannedItem.ItemNumber);
        // console.log('🎬 handleBarcodeScanned - Media data:', scannedItem.mediaData);
        
        // Navigate to item details with media callback
        navigation.navigate('LoadToDockItemDetails', {
          deliveryItem,
          itemDetail: scannedItem,
          existingMediaStatus: getItemMediaStatus(scannedItem),
          existingMedia: getItemMediaStatus(scannedItem)?.capturedMedia || [],
          onMediaSaved: createMediaSavedCallback(scannedItem.ItemNumber)
        });
      } else {
        showError('Item Not Found', `No item found with barcode: ${barcode}`);
      }
    } catch (error) {
      console.error('Error searching scanned item:', error);
      showError('Scan Error', 'Failed to process scanned barcode');
    }
  }, [scanItem, showSuccess, showError, navigation, deliveryItem, getItemMediaStatus, createMediaSavedCallback]);

  const handleScannerClose = () => {
    setIsScannerVisible(false);
  };







  const handleLoadToDock = async () => {
    try {
      if (!canLoadToDock) {
        showError('Cannot Load to Dock', 'Please ensure all requirements are met');
        return;
      }



      // Show loading state
      // Note: isLoading is managed by the useLoadToDockItems hook

      // Prepare request data
      const userData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_USER_ID);
      const userIdArray = getDataFromResultSet(userData);

      const responsibilityData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_USER_RESPONSIBILITIES);
      const responsibilityArray = getDataFromResultSet(responsibilityData);
      const loadToDockResponsibility = responsibilityArray.filter((responsibility: any) => responsibility.RESPONSIBILITY.toLowerCase() === RESPONSIBILITIES.LOAD_TO_DOCK);


      const request: LoadToDockRequest = {
        // deliveryId: deliveryItem.deliveryId,
        vehicleNumber: vehicleNumber.trim(),
        dockDoor: 'DOCK001', // You can make this configurable
        inventoryOrgId: defaultOrgId, // You should get this from user context
        userId: userIdArray[0].USER_ID || '1001', // You should get this from user context
        responsibilityId: loadToDockResponsibility[0]?.RESPONSIBILITY_ID || '66732', // Default responsibility ID
        items: items
          .filter(item => {
            const hasMedia = item.mediaData?.hasPhotos && item.mediaData?.hasVideo;
            const hasQuantity = Number(item.QtyPicked) > 0;
            return hasMedia && hasQuantity;
          })
      };

      if(!request.items) {
        showError('Error', 'Please add at least one item to load to dock');
        return;
      }

      // Process the request
      const result = await loadToDockService.processLoadToDock(request);

      if (result.success) {
        if (result.offline) {
          showSuccess('Data Saved Locally', 'Your data has been saved locally and will sync when you\'re back online.');
        } else {
          showSuccess('Success', 'Items loaded to dock successfully!');
        }
        
        // Navigate back to list page
        navigation.goBack();
      } else {
        showError('Error', result.error || 'Failed to load items to dock');
      }

    } catch (error) {
      console.error('Error loading to dock:', error);
      showError('Error', 'Failed to load items to dock');
    } finally {
      // Note: isLoading is managed by the useLoadToDockItems hook
    }
  };




  const renderItem = useCallback((item: ILoadToDockItemDetail, index: number) => (
    <LoadToDockItemCard
      key={`${item.DeliveryLineId}-${item.mediaData?.hasPhotos || false}-${item.mediaData?.hasVideo || false}`}
      item={item}
      index={index}
      styles={styles}
      onItemPress={navigateToItemDetails}
      onQuantityChange={updateItemQuantity}
      onQuantityError={showError}
    />
  ), [navigateToItemDetails, updateItemQuantity, showError, styles]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={theme.colors.background === '#121212' ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.primary} 
      />
      
      {/* Header */}
      <LoadToDockHeader
        deliveryId={deliveryItem.deliveryId}
        onBack={() => navigation.goBack()}
        onHome={handleBackToDashboard}
      />

      {/* Delivery Details */}
      <DeliveryDetailsCard
        salesOrderNumber={deliveryItem.salesOrderNumber}
        customerName={deliveryItem.customerName}
        itemCount={deliveryItem.itemCount || items.length}
        date={deliveryItem.date}
      />

      {/* Vehicle Input Section */}
      <VehicleInputSection
        vehicleNumber={vehicleNumber}
        onVehicleNumberChange={setVehicleNumber}
        isFocused={vehicleInputFocused}
        onFocus={() => setVehicleInputFocused(true)}
        onBlur={() => setVehicleInputFocused(false)}
        theme={theme}
        style={styles.inputSection}
      />

      {/* Search and Scan Section */}
      <SearchAndScanSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScanPress={handleScanItem}
        style={styles.searchContainer}
      />

      {/* Items List */}
      <View style={styles.itemsSection}>
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Items to Load</Text>
          <Text style={styles.itemCount}>
            {filteredItems.length} of {deliveryItem.itemCount || items.length} items
          </Text>
        </View> */}
        
        <ScrollView 
          style={styles.itemsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemsListContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or scan a barcode</Text>
            </View>
          ) : (
            filteredItems.map((item, index) => renderItem(item, index))
          )}
        </ScrollView>
      </View>

      {/* Sticky Load to Dock Button - Dynamically positioned above bottom navigation */}
      <View style={[
        styles.bottomButtonContainer,
        { paddingBottom: Math.max(40, insets.bottom + 20) } // Ensures button is always visible above navigation
      ]}>
        <Button
          title="Load To Dock"
          onPress={handleLoadToDock}
          disabled={!canLoadToDock}
          size="lg"
          variant="solid"
          colorScheme="primary"
          fullWidth
          style={styles.loadToDockButton}
          textStyle={styles.loadToDockButtonText}
        />
      </View>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={isScannerVisible}
        onClose={handleScannerClose}
        onBarcodeScanned={handleBarcodeScanned}
        showManualInput={true}
        scanBarcode={true}
        showFrame={true}
        barcodeFrameSize={{ width: 280, height: 140 }}
        laserColor="#00ff00"
        frameColor="#1e3a8a"
        onError={(error) => {
          console.error('Scanner error:', error);
          showError('Scanner Error', error);
        }}
      />
    </SafeAreaView>
  );
};

export default LoadToDockItemsScreen;
