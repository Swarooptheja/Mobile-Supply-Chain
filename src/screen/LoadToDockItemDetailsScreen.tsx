import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { MediaCapture, ItemDetailsCard, DynamicTabs, IconComponent, CommonIcon } from '../components';
import { loadToDockService } from '../services/loadToDockService';
import { LoadToDockItemDetailsScreenProps, TabType } from '../types/loadToDock.interface';
import { IMediaItem } from '../types/media.interface';
import { useToast } from '../utils/toastUtils';

const LoadToDockItemDetailsScreen: React.FC<LoadToDockItemDetailsScreenProps> = ({ route, navigation }) => {
  const { deliveryItem, itemDetail } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('photos');
  const [capturedMedia, setCapturedMedia] = useState<IMediaItem[]>([]);
  const [hasPhotos, setHasPhotos] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast();
  
  // Store toast functions in refs to avoid dependency issues
  const showErrorToastRef = useRef(showErrorToast);
  const showSuccessToastRef = useRef(showSuccessToast);
  
  // Update refs when toast functions change
  useEffect(() => {
    showErrorToastRef.current = showErrorToast;
    showSuccessToastRef.current = showSuccessToast;
  }, [showErrorToast, showSuccessToast]);
  
  // Memoize filtered media arrays to prevent unnecessary re-renders
  const photoMedia = useMemo(() => capturedMedia.filter(media => media.type === 'photo'), [capturedMedia]);
  const videoMedia = useMemo(() => capturedMedia.filter(media => media.type === 'video'), [capturedMedia]);

  // Check if we can save whenever capturedMedia changes
  useEffect(() => {
    const photosExist = photoMedia.length > 0;
    const videosExist = videoMedia.length > 0;
    
    setHasPhotos(photosExist);
    setHasVideo(videosExist);
    setCanSave(photosExist && videosExist);
  }, [capturedMedia, photoMedia.length, videoMedia.length]);

  const handlePhotoCaptured = useCallback((media: IMediaItem[]) => {
    setCapturedMedia(prev => {
      // Remove existing photos and add new photos
      const otherMedia = prev.filter(item => item.type !== 'photo');
      return [...otherMedia, ...media];
    });
  }, []);

  const handleVideoCaptured = useCallback((media: IMediaItem[]) => {
    setCapturedMedia(prev => {
      // Remove existing videos and add new videos
      const otherMedia = prev.filter(item => item.type !== 'video');
      return [...otherMedia, ...media];
    });
  }, []);

  const handleMediaRemoved = useCallback((mediaId: string) => {
    setCapturedMedia(prev => prev.filter(item => item.id !== mediaId));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!canSave) {
        Alert.alert('Cannot Save', 'Please capture both photos AND video to proceed');
        return;
      }

      // Store the actual media content with base64 data
      await loadToDockService.storeMediaContent(
        deliveryItem.deliveryId,
        itemDetail.ItemId,
        capturedMedia
      );

      // Update media status in database
      await loadToDockService.updateMediaStatus(
        deliveryItem.deliveryId,
        itemDetail.ItemId,
        hasPhotos,
        hasVideo
      );

      showSuccessToastRef.current('Success', 'Media captured and saved successfully!');
      
      // Navigate back to items page
      navigation.goBack();
    } catch (error) {
      console.error('Error saving media:', error);
      showErrorToastRef.current('Error', 'Failed to save media');
    }
  }, [canSave, deliveryItem.deliveryId, itemDetail.ItemId, capturedMedia, navigation, hasPhotos, hasVideo]);

  const handleBackToItems = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  // Dynamic tabs configuration with dynamic icon colors
  const tabs = useMemo(() => [
    {
      id: 'photos',
      label: 'PHOTOS',
      icon: (
        <CommonIcon 
          icon="camera"
          size={25} 
          color={activeTab === 'photos' ? '#ffffff' : '#6b7280'}
        />
      ),
      content: (
        <View style={styles.tabContent}>
          <MediaCapture
            mediaType="photo"
            maxPhotos={10}
            onMediaCaptured={handlePhotoCaptured}
            onMediaRemoved={handleMediaRemoved}
            existingMedia={photoMedia}
            style={styles.mediaCaptureArea}
          />
        </View>
      )
    },
    {
      id: 'video',
      label: 'VIDEO',
      icon: (
        <CommonIcon 
          icon="video"
          size={25} 
          color={activeTab === 'video' ? '#ffffff' : '#6b7280'}
        />
      ),
      content: (
        <View style={styles.tabContent}>
          <MediaCapture
            mediaType="video"
            maxVideos={5}
            onMediaCaptured={handleVideoCaptured}
            onMediaRemoved={handleMediaRemoved}
            existingMedia={videoMedia}
            style={styles.mediaCaptureArea}
          />
        </View>
      )
    }
  ], [activeTab, photoMedia, videoMedia, handlePhotoCaptured, handleVideoCaptured, handleMediaRemoved]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <AppHeader 
        title={`Pick Slip #${itemDetail.ItemNumber}`}
        leftElement={
          <TouchableOpacity onPress={handleBackToItems} style={styles.backButton}>
            {/* <IconComponent name="arrow-left" size={24} color="#ffffff" /> */}
            <CommonIcon 
                icon="back"
                size={24} 
                color="#ffffff"
              />
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity onPress={handleNavigateToDashboard} style={styles.homeButton}>
            {/* <IconComponent name="home" size={20} color="#ffffff" /> */}
            <CommonIcon 
                icon="home"
                size={20} 
                color="#ffffff"
              />
          </TouchableOpacity>
        }
      />

      {/* Item Details */}
      <ItemDetailsCard
        itemNumber={itemDetail.ItemNumber}
        itemDescription={itemDetail.ItemDesc}
        qtyRequested={itemDetail.QtyRequested}
        qtyPicked={itemDetail.QtyPicked}
        itemUom={itemDetail.ItemUom}
      />

      {/* Dynamic Media Tabs */}
      <DynamicTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeIconStyle={{ color: '#ffffff' }}
        activeLabelStyle={{ color: '#ffffff' }}
      />

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
  homeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  mediaCaptureArea: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    paddingVertical: 16,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default LoadToDockItemDetailsScreen;
