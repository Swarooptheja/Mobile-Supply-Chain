import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CommonIcon, ScanButton, SearchBar } from '../components';
import AppHeader from '../components/AppHeader';
import BarcodeScanner from '../components/BarcodeScanner';
import Button from '../components/Button';
import { loadToDockService } from '../services/loadToDockService';
import { ILoadToDockItemDetail, LoadToDockItemsScreenProps } from '../types/loadToDock.interface';
import { useToast } from '../utils/toastUtils';

const LoadToDockItemsScreen: React.FC<LoadToDockItemsScreenProps> = ({ route, navigation }) => {
  const { deliveryItem } = route.params;
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ILoadToDockItemDetail[]>([]);
  const [filteredItems, setFilteredItems] = useState<ILoadToDockItemDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadToDock, setCanLoadToDock] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast();
  const showErrorToastRef = useRef(showErrorToast);

  // Update ref when showErrorToast changes
  useEffect(() => {
    showErrorToastRef.current = showErrorToast;
  }, [showErrorToast]);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
        try {
          const data = await loadToDockService.getItemsByDeliveryId(deliveryItem.deliveryId);
          setItems(data);
          setFilteredItems(data);
        } catch (serviceError) {
          showErrorToastRef.current('Service Warning', 'Service not available, using fallback data');
        } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [deliveryItem.deliveryId]); // Only depend on deliveryItem.deliveryId

  useEffect(() => {
    // Search items from database based on search query
    const searchItems = async () => {
      if (!searchQuery.trim()) {
        setFilteredItems(items);
        return;
      }

      try {
        setIsLoading(true);
        const searchResults = await loadToDockService.searchItemsByDeliveryId(
          deliveryItem.deliveryId,
          searchQuery
        );
        setFilteredItems(searchResults);
      } catch (error) {
        console.error('Error searching items:', error);
        showErrorToastRef.current('Search Error', 'Failed to search items');;
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many database calls
    const timeoutId = setTimeout(() => {
      searchItems();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, deliveryItem.deliveryId, items]);

  useEffect(() => {
    // Check if all requirements are satisfied
    const allItemsHaveMedia = items.every(item => item.hasPhotos && item.hasVideo);
    const allItemsHaveQuantities = items.every(item => Number(item.QtyPicked) > 0);
    const vehicleEntered = vehicleNumber.trim().length > 0;
    
    setCanLoadToDock(allItemsHaveMedia && allItemsHaveQuantities && vehicleEntered);
  }, [items, vehicleNumber]);

  const handleScanItem = () => {
    setIsScannerVisible(true);
  };

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      // Search for the scanned item in the database
      const searchResults = await loadToDockService.scanItemsByDeliveryId(
        deliveryItem.deliveryId,
        barcode
      );
      
      if (searchResults.length) {
        const scannedItem = searchResults[0];
        showSuccessToast('Item Found', `Scanned: ${barcode}`);
        
        // Redirect to the item details screen
        navigation.navigate('LoadToDockItemDetails', {
          deliveryItem,
          itemDetail: scannedItem
        });
      } else {
        showErrorToast('Item Not Found', `No item found with barcode: ${barcode}`);
      }
    } catch (error) {
      console.error('Error searching scanned item:', error);
      showErrorToast('Scan Error', 'Failed to process scanned barcode');
    }
  };

  const handleScannerClose = () => {
    setIsScannerVisible(false);
  };

  const handleItemPress = (item: ILoadToDockItemDetail) => {
    navigation.navigate('LoadToDockItemDetails', {
      deliveryItem,
      itemDetail: item
    });
  };

  const handleLoadToDock = async () => {
    try {
      if (!canLoadToDock) {
        showErrorToast('Cannot Load to Dock', 'Please ensure all requirements are met');
        return;
      }

      // TODO: Implement Load to Dock functionality
      showSuccessToast('Success', 'Items loaded to dock successfully!');
      
      // Navigate back to list page
      navigation.goBack();
    } catch (error) {
      console.error('Error loading to dock:', error);
      showErrorToast('Error', 'Failed to load items to dock');
    }
  };

  const handleBackToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const updateItemQuantity = (itemNumber: string, newQuantity: number) => {
    const updatedItems = items.map(i => 
      i.ItemNumber === itemNumber 
        ? { ...i, QtyPicked: newQuantity.toString() }
        : i
    );
    setItems(updatedItems);
  };

  const renderItem = (item: ILoadToDockItemDetail, index: number) => (
    <TouchableOpacity
      key={item.ItemNumber}
      style={[
        styles.itemCard,
        item.hasPhotos && item.hasVideo && styles.completedItemCard
      ]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemId}>{index + 1}. {item.ItemNumber}</Text>
        <TouchableOpacity style={styles.arrowButton}>
          <CommonIcon 
                icon="arrowRight"
                size={16} 
                color="#6b7280"
              />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.itemDescription}>{item.ItemDesc}</Text>
      
      <View style={styles.quantityRow}>
        <Text style={styles.quantityLabel}>Requested: {item.QtyRequested} {item.ItemUom}</Text>
      </View>
      
      <View style={styles.loadedQuantityRow}>
        <Text style={styles.quantityLabel}>Loaded: </Text>
        <TextInput
          style={styles.quantityInput}
          value={item.QtyPicked}
          onChangeText={(text) => {
            const newQuantity = parseInt(text) || 0;
            if (newQuantity > Number(item.QtyRequested)) {
              showErrorToast('Error', 'Loaded quantity cannot exceed requested quantity');
              return;
            }
            updateItemQuantity(item.ItemNumber, newQuantity);
          }}
          keyboardType="numeric"
          placeholder="0"
        />
        <Text style={styles.quantityLabel}> of {item.QtyRequested} {item.ItemUom}</Text>
      </View>
      
      <View style={styles.mediaStatus}>
        <View style={[styles.statusDot, { backgroundColor: item.hasPhotos ? '#10b981' : '#f59e0b' }]} />
        <Text style={styles.statusText}>{item.hasPhotos ? 'Photos ✓' : 'Photos Pending'}</Text>
        <View style={[styles.statusDot, { backgroundColor: item.hasVideo ? '#10b981' : '#f59e0b' }]} />
        <Text style={styles.statusText}>{item.hasVideo ? 'Video ✓' : 'Video Pending'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <AppHeader 
        title={`Pick Slip #${deliveryItem.deliveryId}`}
        leftElement={
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* <IconComponent name="arrow-left" size={24} color="#ffffff" />
             */}
             <CommonIcon 
                icon="back"
                size={24} 
                color="#ffffff"
              />
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity onPress={handleBackToDashboard} style={styles.homeButton}>
            <CommonIcon 
                icon="home"
                size={20} 
                color="#ffffff"
              />
          </TouchableOpacity>
        }
      />

      {/* Compact Details Section */}
      <View style={styles.compactDetailsSection}>
        <View style={styles.detailsRow}>
          <View style={styles.leftDetails}>
            <Text style={styles.detailLabel}>SO# {deliveryItem.salesOrderNumber}</Text>
            <Text style={styles.detailValue}>{deliveryItem.customerName}</Text>
            <Text style={styles.detailLabel}>Total Items: {deliveryItem.itemCount || items.length}</Text>
          </View>
          <View style={styles.rightDetails}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{deliveryItem.date}</Text>
          </View>
        </View>
      </View>

      {/* Enhanced Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.vehicleInputContainer}>
          <Text style={styles.vehicleLabel}>Vehicle#</Text>
          <TextInput
            style={styles.vehicleInput}
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            placeholder="Enter Vehicle Number"
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              placeholder="Search items"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScanButton
            onPress={handleScanItem}
            size={48}
            iconColor="#ffffff"
            backgroundColor="#1e3a8a"
            borderColor="#1e3a8a"
            hintText="Scan"
            hintTextColor="#6b7280"
          />
        </View>
      </View>

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

      {/* Load to Dock Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          title="LOAD TO DOCK"
          onPress={handleLoadToDock}
          style={canLoadToDock ? styles.loadToDockButton : styles.disabledButton}
          textStyle={styles.loadToDockButtonText}
          disabled={!canLoadToDock}
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
          showErrorToastRef.current('Scanner Error', error);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  homeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  homeIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  compactDetailsSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftDetails: {
    flex: 1,
  },
  rightDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  inputSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  vehicleInputContainer: {
    marginBottom: 12,
  },
  vehicleLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 6,
  },
  vehicleInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarWrapper: {
    flex: 1,
  },
  itemsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemCount: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedItemCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  arrowButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  quantityRow: {
    marginBottom: 6,
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#1e3a8a',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 13,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    minWidth: 40,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  mediaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  loadToDockButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  loadToDockButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoadToDockItemsScreen;
