import React, { useCallback, useState, useRef } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDataFromResultSet } from '../../services/sharedService';
import {
  AppHeader,
  DeliveryDetailsCard,
  HeaderButton,
  LoadToDockItemCard,
  SearchAndScanSection,
  VehicleInputSection
} from '../components';
import { TransactionBanner } from '../components/TransactionBanner';
import BarcodeScanner from '../components/BarcodeScanner';
import { Button } from '../components/Button';
import { RESPONSIBILITIES } from '../config/api';
import { LOGIN_QUERIES } from '../constants/queries';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { useLoadToDockItems } from '../hooks/useLoadToDockItems';
import { useLoadToDockValidation } from '../hooks/useLoadToDockValidation';
import { useNavigationHandlers } from '../hooks/useNavigationHandlers';
import { useSearchWithDebounce } from '../hooks/useSearchWithDebounce';
import { useTransactionBanner } from '../hooks/useTransactionBanner';
import { LoadToDockRequest, loadToDockService } from '../services/loadToDockService';
import { simpleDatabaseService } from '../services/simpleDatabase';
import { createLoadToDockItemsScreenStyles } from '../styles/LoadToDockItemsScreen.styles';
import { ILoadToDockItemDetail, LoadToDockItemsScreenProps } from '../types/loadToDock.interface';
import { realTimeSyncTransactionService } from '../services/realTimeSyncTransactionService';

const LoadToDockItemsScreen: React.FC<LoadToDockItemsScreenProps> = ({ route, navigation }) => {
  const { deliveryItem } = route.params;
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [vehicleInputFocused, setVehicleInputFocused] = useState(false);
  
  const { showError, showSuccess } = useAttractiveNotification();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { defaultOrgId } = useAuth();

  // Transaction banner management
  const {
    bannerState,
    showUploading,
    updateProgress,
    showSuccess: showBannerSuccess,
    showError: showBannerError,
    showOffline,
    hideBanner,
  } = useTransactionBanner({
    autoHide: true,
    autoHideDelay: 3000,
    showProgress: true,
  });

  // Ref to track if transaction is in progress to prevent duplicate calls
  const isTransactionInProgress = useRef(false);

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
        showSuccess(t('loadToDock.itemFound'), t('loadToDock.scanned', { barcode }));
        
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
        showError(t('loadToDock.itemNotFound'), t('loadToDock.noItemWithBarcode', { barcode }));
      }
    } catch (error) {
      console.error('Error searching scanned item:', error);
      showError(t('loadToDock.scanError'), t('loadToDock.failedToProcessBarcode'));
    }
  }, [scanItem, showSuccess, showError, navigation, deliveryItem, getItemMediaStatus, createMediaSavedCallback]);

  const handleScannerClose = () => {
    setIsScannerVisible(false);
  };







  const handleLoadToDock = useCallback(async () => {
    // Prevent duplicate calls
    if (isTransactionInProgress.current) {
      console.warn('Transaction already in progress, ignoring duplicate call');
      return;
    }

    try {
      if (!canLoadToDock) {
        showError(t('loadToDock.cannotSave'), t('loadToDock.captureBothMedia'));
        return;
      }

      // Set transaction in progress flag
      isTransactionInProgress.current = true;

      // Show uploading banner
      showUploading(t('loadToDock.preparingDocuments'), { showProgress: true });

      // Step 1: Validate and prepare data
      updateProgress(10, t('loadToDock.validatingRequirements'));

      // Prepare request data with error handling
      let userData, responsibilityData;
      try {
        userData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_USER_ID);
        const userIdArray = getDataFromResultSet(userData);
        
        if (!userIdArray || userIdArray.length === 0) {
          throw new Error('User ID not found');
        }

        // updateProgress(20, 'Preparing transaction data...');

        responsibilityData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_USER_RESPONSIBILITIES);
        const responsibilityArray = getDataFromResultSet(responsibilityData);
        const loadToDockResponsibility = responsibilityArray.filter((responsibility: any) => 
          responsibility.RESPONSIBILITY.toLowerCase() === RESPONSIBILITIES.LOAD_TO_DOCK
        );

        // if (!loadToDockResponsibility || loadToDockResponsibility.length === 0) {
        //   throw new Error('Load to Dock responsibility not found');
        // }

        // updateProgress(30, 'Validating items and media...');

        // Filter and validate items
        const validItems = items.filter(item => {
          const hasMedia = item.mediaData?.hasPhotos && item.mediaData?.hasVideo;
          const hasQuantity = Number(item.QtyPicked) > 0;
          return hasMedia && hasQuantity;
        });

        if (!validItems.length) {
          throw new Error(t('loadToDock.noValidItems'));
        }

        // updateProgress(40, 'Creating transaction request...');

        const request: LoadToDockRequest = {
          vehicleNumber: vehicleNumber.trim(),
          dockDoor: 'DOCK001',
          inventoryOrgId: defaultOrgId,
          userId: userIdArray[0].USER_ID || '1001',
          responsibilityId: loadToDockResponsibility[0]?.RESPONSIBILITY_ID || '66732',
          items: validItems
        };

        updateProgress(50, t('loadToDock.uploadingToCloud'));

        // Process the request
        const data = await loadToDockService.storeLoadToDockTransaction(request);
        
        if(!data.success) {
          return;
        };

        // const result = await loadToDockService.processLoadToDock();
        const result = await realTimeSyncTransactionService.syncTransaction(RESPONSIBILITIES.LOAD_TO_DOCK);

        updateProgress(90, t('loadToDock.finalizingUpload'));

        if (result.success) {
          updateProgress(100, t('loadToDock.uploadComplete'));
          
          if (result.offline) {
            showOffline(t('loadToDock.dataSavedLocally'), {
              autoHide: true,
              autoHideDelay: 4000
            });
          } else {
            showBannerSuccess(t('loadToDock.documentsUploadedSuccess'), {
              autoHide: true,
              autoHideDelay: 3000
            });
          }
          
          // Auto-navigate after success (with delay for user to see success message)
          setTimeout(() => {
            navigation.goBack();
          }, result.offline ? 4000 : 3000);
        } else {
          throw new Error(result.error || t('loadToDock.failedToUpload'));
        }

      } catch (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`);
      }

    } catch (error) {
      console.error('Error loading to dock:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('loadToDock.failedToUpload');
      
      showBannerError(errorMessage, {
        autoHide: false // Don't auto-hide error banners
      });
      
    } finally {
      // Reset transaction in progress flag
      isTransactionInProgress.current = false;
    }
  }, [
    canLoadToDock, 
    showError, 
    showUploading, 
    updateProgress, 
    showOffline, 
    showBannerSuccess, 
    showBannerError, 
    navigation, 
    vehicleNumber, 
    defaultOrgId, 
    items
  ]);

  // Handle retry for failed transactions
  const handleRetryTransaction = useCallback(() => {
    hideBanner();
    handleLoadToDock();
  }, [hideBanner, handleLoadToDock]);

  // Handle banner dismiss
  const handleDismissBanner = useCallback(() => {
    hideBanner();
  }, [hideBanner]);

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
        onRetry={bannerState.status === 'error' ? handleRetryTransaction : undefined}
        testID="load-to-dock-transaction-banner"
      />
      

<AppHeader 
    title={t('loadToDock.pickSlip', { deliveryId: deliveryItem.deliveryId })}
    leftElement={
      <HeaderButton
        icon="back"
        onPress={() => navigation.goBack()}
        backgroundColor={'#1e3a8a'}
      />
    }
    rightElement={
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <HeaderButton
          icon="home"
          onPress={handleBackToDashboard}
          backgroundColor={'#1e3a8a'}

          
        />
      </View>
    }
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
              <Text style={styles.loadingText}>{t('loadToDock.loading')}</Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('loadToDock.noItemsFound')}</Text>
              <Text style={styles.emptySubtext}>{t('loadToDock.tryAdjustingSearch')}</Text>
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
          title={t('loadToDock.loadToDockButton')}
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
          showError(t('loadToDock.scannerError'), error);
        }}
      />
    </SafeAreaView>
  );
};

export default LoadToDockItemsScreen;
