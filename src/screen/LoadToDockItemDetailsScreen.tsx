import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { ILoadToDockItem, ILoadToDockItemDetail } from '../types/loadToDock.interface';
import { loadToDockService } from '../services/loadToDockService';
import { useToast } from '../utils/toastUtils';

interface LoadToDockItemDetailsScreenProps {
  route: {
    params: {
      deliveryItem: ILoadToDockItem;
      itemDetail: ILoadToDockItemDetail;
    };
  };
  navigation: any;
}

type TabType = 'photos' | 'video';

const LoadToDockItemDetailsScreen: React.FC<LoadToDockItemDetailsScreenProps> = ({ route, navigation }) => {
  const { deliveryItem, itemDetail } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('photos');
  const [hasPhotos, setHasPhotos] = useState(itemDetail.hasPhotos || false);
  const [hasVideo, setHasVideo] = useState(itemDetail.hasVideo || false);
  const [canSave, setCanSave] = useState(false);
  const { showErrorToast, showSuccessToast, showInfoToast } = useToast();

  useEffect(() => {
    // Check if we can save (either photos or video is captured)
    setCanSave(hasPhotos || hasVideo);
  }, [hasPhotos, hasVideo]);

  const handleTakePhoto = () => {
    // TODO: Implement camera functionality
    showInfoToast('Take Photo', 'Camera functionality will be implemented here');
    setHasPhotos(true);
  };

  const handleChooseFromGallery = () => {
    // TODO: Implement gallery selection
    showInfoToast('Choose from Gallery', 'Gallery selection will be implemented here');
    setHasPhotos(true);
  };

  const handleTakeVideo = () => {
    // TODO: Implement video recording
    showInfoToast('Take Video', 'Video recording will be implemented here');
    setHasVideo(true);
  };

  const handleSave = async () => {
    try {
      if (!canSave) {
        showErrorToast('Cannot Save', 'Please capture at least photos or video');
        return;
      }

      // Update media status in database
      await loadToDockService.updateMediaStatus(
        deliveryItem.deliveryId,
        itemDetail.ItemId,
        hasPhotos || false,
        hasVideo || false
      );

      showSuccessToast('Success', 'Media captured and saved successfully!');
      
      // Navigate back to items page
      navigation.goBack();
    } catch (error) {
      console.error('Error saving media:', error);
      showErrorToast('Error', 'Failed to save media');
    }
  };

  const handleBackToItems = () => {
    navigation.goBack();
  };

  const renderPhotosTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.mediaCaptureArea}>
        <View style={styles.mediaIconContainer}>
          <Text style={styles.mediaIcon}>📷</Text>
        </View>
        <Text style={styles.mediaTitle}>Capture Content Photos</Text>
        <Text style={styles.mediaSubtitle}>Take photos of the item for documentation</Text>
        
        <View style={styles.mediaButtons}>
          <Button
            title="Take Photo"
            onPress={handleTakePhoto}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />
          <Button
            title="Choose from Gallery"
            onPress={handleChooseFromGallery}
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
        </View>
      </View>
    </View>
  );

  const renderVideoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.mediaCaptureArea}>
        <View style={styles.mediaIconContainer}>
          <Text style={styles.mediaIcon}>🎥</Text>
        </View>
        <Text style={styles.mediaTitle}>Capture Content Video</Text>
        <Text style={styles.mediaSubtitle}>Record video of the item for documentation</Text>
        
        <View style={styles.mediaButtons}>
          <Button
            title="Take Video"
            onPress={handleTakeVideo}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <AppHeader 
        title={`Pick Slip #${deliveryItem.deliveryId}`}
        leftElement={
          <TouchableOpacity onPress={handleBackToItems} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.homeButton}>
            <Text style={styles.homeIcon}>🏠</Text>
          </TouchableOpacity>
        }
      />

      {/* Item Details */}
      <View style={styles.itemDetailsCard}>
        <Text style={styles.itemIdentifier}>{itemDetail.ItemId} . {itemDetail.ItemNumber}</Text>
        <Text style={styles.itemDescription}>{itemDetail.ItemDesc}</Text>
        
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Requested Qty: {itemDetail.QtyRequested} {itemDetail.ItemUom}</Text>
          <View style={styles.loadedQuantityRow}>
            <Text style={styles.quantityLabel}>Loaded Qty: </Text>
            <Text style={styles.quantityValue}>{itemDetail.QtyPicked}</Text>
            <Text style={styles.quantityLabel}> of {itemDetail.QtyRequested} {itemDetail.ItemUom}</Text>
          </View>
        </View>
      </View>

      {/* Media Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'photos' && styles.activeTab
          ]}
          onPress={() => setActiveTab('photos')}
        >
          <Text style={[
            styles.tabIcon,
            activeTab === 'photos' && styles.activeTabIcon
          ]}>📷</Text>
          <Text style={[
            styles.tabText,
            activeTab === 'photos' && styles.activeTabText
          ]}>PHOTOS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'video' && styles.activeTab
          ]}
          onPress={() => setActiveTab('video')}
        >
          <Text style={[
            styles.tabIcon,
            activeTab === 'video' && styles.activeTabIcon
          ]}>🎥</Text>
          <Text style={[
            styles.tabText,
            activeTab === 'video' && styles.activeTabText
          ]}>VIDEO</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'photos' ? renderPhotosTab() : renderVideoTab()}

      {/* Save Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          title="SAVE"
          onPress={handleSave}
          style={canSave ? styles.saveButton : styles.disabledButton}
          textStyle={styles.saveButtonText}
          disabled={!canSave}
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
  itemDetailsCard: {
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
  itemIdentifier: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 16,
  },
  quantitySection: {
    gap: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
  },
  tabIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  activeTabIcon: {
    color: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mediaCaptureArea: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e3a8a',
    borderStyle: 'dashed',
    minHeight: 300,
    justifyContent: 'center',
  },
  mediaIconContainer: {
    marginBottom: 16,
  },
  mediaIcon: {
    fontSize: 48,
    color: '#9ca3af',
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  mediaSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  mediaButtons: {
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 14,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoadToDockItemDetailsScreen;
