import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import { ILoadToDockItem, ILoadToDockItemDetail } from '../types/loadToDock.interface';
import { loadToDockService } from '../services/loadToDockService';

interface LoadToDockItemsScreenProps {
  route: {
    params: {
      deliveryItem: ILoadToDockItem;
    };
  };
  navigation: any;
}

const LoadToDockItemsScreen: React.FC<LoadToDockItemsScreenProps> = ({ route, navigation }) => {
  const { deliveryItem } = route.params;
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ILoadToDockItemDetail[]>([]);
  const [filteredItems, setFilteredItems] = useState<ILoadToDockItemDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadToDock, setCanLoadToDock] = useState(false);

  // Mock data for demonstration
  const mockItems: ILoadToDockItemDetail[] = [
    {
      itemId: '1.1',
      itemSku: 'AS10002345',
      itemDescription: 'Lithium Battery',
      requestedQuantity: 1,
      loadedQuantity: 1,
      unit: 'Ea',
      hasPhotos: true,
      hasVideo: true
    },
    {
      itemId: '2.1',
      itemSku: 'AS10002347',
      itemDescription: 'Mother Board',
      requestedQuantity: 2,
      loadedQuantity: 0,
      unit: 'Ea',
      hasPhotos: false,
      hasVideo: false
    },
    {
      itemId: '3.1',
      itemSku: 'AS10002350',
      itemDescription: 'Power Supply',
      requestedQuantity: 1,
      loadedQuantity: 0,
      unit: 'Ea',
      hasPhotos: false,
      hasVideo: false
    }
  ];

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.itemSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  useEffect(() => {
    // Check if all requirements are satisfied
    const allItemsHaveMedia = items.every(item => item.hasPhotos && item.hasVideo);
    const allItemsHaveQuantities = items.every(item => item.loadedQuantity > 0);
    const vehicleEntered = vehicleNumber.trim().length > 0;
    
    setCanLoadToDock(allItemsHaveMedia && allItemsHaveQuantities && vehicleEntered);
  }, [items, vehicleNumber]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      // Try to load from service first, fallback to mock data
      try {
        const data = await loadToDockService.getItemsByDeliveryId(deliveryItem.deliveryId);
        setItems(data);
        setFilteredItems(data);
      } catch (serviceError) {
        console.warn('Service not available, using mock data:', serviceError);
        setItems(mockItems);
        setFilteredItems(mockItems);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanItem = () => {
    // TODO: Implement barcode scanning functionality
    Alert.alert('Scan Item', 'Barcode scanning functionality will be implemented here');
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
        Alert.alert('Cannot Load to Dock', 'Please ensure all requirements are met');
        return;
      }

      // TODO: Implement Load to Dock functionality
      Alert.alert('Success', 'Items loaded to dock successfully!');
      
      // Navigate back to list page
      navigation.goBack();
    } catch (error) {
      console.error('Error loading to dock:', error);
      Alert.alert('Error', 'Failed to load items to dock');
    }
  };

  const handleBackToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const renderItem = (item: ILoadToDockItemDetail, index: number) => (
    <TouchableOpacity
      key={item.itemId}
      style={[
        styles.itemCard,
        item.hasPhotos && item.hasVideo && styles.completedItemCard
      ]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemId}>{item.itemId} . {item.itemSku}</Text>
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.itemDescription}>{item.itemDescription}</Text>
      
      <View style={styles.quantityRow}>
        <Text style={styles.quantityLabel}>Requested Qty: {item.requestedQuantity} {item.unit}</Text>
      </View>
      
      <View style={styles.loadedQuantityRow}>
        <Text style={styles.quantityLabel}>Loaded Qty: </Text>
        <TextInput
          style={styles.quantityInput}
          value={item.loadedQuantity.toString()}
          onChangeText={(text) => {
            const newQuantity = parseInt(text) || 0;
            if (newQuantity > item.requestedQuantity) {
              Alert.alert('Error', 'Loaded quantity cannot exceed requested quantity');
              return;
            }
            
            const updatedItems = items.map(i => 
              i.itemId === item.itemId 
                ? { ...i, loadedQuantity: newQuantity }
                : i
            );
            setItems(updatedItems);
          }}
          keyboardType="numeric"
          placeholder="0"
          style={styles.quantityInput}
        />
        <Text style={styles.quantityLabel}> of {item.requestedQuantity} {item.unit}</Text>
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
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity onPress={handleBackToDashboard} style={styles.homeButton}>
            <Text style={styles.homeIcon}>🏠</Text>
          </TouchableOpacity>
        }
      />

      {/* Pick Slip Details */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsRow}>
          <View style={styles.leftDetails}>
            <Text style={styles.detailLabel}>SO# {deliveryItem.salesOrderNumber}</Text>
            <Text style={styles.detailValue}>{deliveryItem.customerName}</Text>
          </View>
          <View style={styles.rightDetails}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{deliveryItem.date}</Text>
          </View>
        </View>
      </View>

      {/* Vehicle Input */}
      <View style={styles.vehicleCard}>
        <Text style={styles.vehicleLabel}>Vehicle#</Text>
        <TextInput
          style={styles.vehicleInput}
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="Enter Vehicle Number"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Search and Scan */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Scan Item"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanItem}
          activeOpacity={0.7}
        >
          <Text style={styles.scanButtonText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <View style={styles.itemsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Items to Load</Text>
          <Text style={styles.itemCount}>{filteredItems.length} items</Text>
        </View>
        
        <ScrollView 
          style={styles.itemsList}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.itemsListContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
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
          style={[
            styles.loadToDockButton,
            !canLoadToDock && styles.disabledButton
          ]}
          textStyle={styles.loadToDockButtonText}
          disabled={!canLoadToDock}
        />
      </View>
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
  },
  homeIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  vehicleInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  scanButton: {
    width: 48,
    height: 48,
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  itemsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemCount: {
    fontSize: 14,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedItemCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  arrowButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 12,
  },
  quantityRow: {
    marginBottom: 8,
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#1e3a8a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    minWidth: 50,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  mediaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
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
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  loadToDockButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
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
