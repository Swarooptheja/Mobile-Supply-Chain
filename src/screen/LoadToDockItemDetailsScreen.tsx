import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Alert
} from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { MediaCapture, ItemDetailsCard, DynamicTabs, CommonIcon, HeaderButton } from '../components';

import { LoadToDockItemDetailsScreenProps, TabType } from '../types/loadToDock.interface';
import { IMediaItem } from '../types/media.interface';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { createLoadToDockItemDetailsScreenStyles } from '../styles/LoadToDockItemDetailsScreen.styles';

const LoadToDockItemDetailsScreen: React.FC<LoadToDockItemDetailsScreenProps> = ({ route, navigation }) => {
  const { itemDetail, existingMediaStatus, existingMedia, onMediaSaved } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('photos');
  const [capturedMedia, setCapturedMedia] = useState<IMediaItem[]>(existingMedia || []);
  const [canSave, setCanSave] = useState(false);
  const { showError, showSuccess } = useAttractiveNotification();
  const theme = useTheme();
  const styles = createLoadToDockItemDetailsScreenStyles(theme);
  
  // Initialize with existing media if available
  useEffect(() => {
    if (existingMedia && existingMedia.length > 0) {
      console.log('🎬 Initializing with existing media:', existingMedia);
      console.log('🎬 Media breakdown:', {
        total: existingMedia.length,
        photos: existingMedia.filter(m => m && m.type === 'photo').length,
        videos: existingMedia.filter(m => m && m.type === 'video').length,
        photoIds: existingMedia.filter(m => m && m.type === 'photo').map(m => m.id),
        videoIds: existingMedia.filter(m => m && m.type === 'video').map(m => m.id)
      });
      setCapturedMedia(existingMedia);
      
      // Set initial media status based on existing media
      const photosExist = existingMedia.some(media => media && media.type === 'photo');
      const videosExist = existingMedia.some(media => media && media.type === 'video');
      setCanSave(photosExist && videosExist);
    } else if (existingMediaStatus) {
      console.log('🎬 Initializing with existing media status:', existingMediaStatus);
      // Set initial state based on existing media status
      setCanSave(existingMediaStatus.hasPhotos && existingMediaStatus.hasVideo);
    }
  }, [existingMedia, existingMediaStatus]);
  
  // Memoize filtered media arrays to prevent unnecessary re-renders
  const photoMedia = useMemo(() => {
    const photos = capturedMedia.filter(media => media && media.type === 'photo');
    console.log('🎬 photoMedia memoized:', photos.length, 'photos');
    return photos;
  }, [capturedMedia]);
  
  const videoMedia = useMemo(() => {
    const videos = capturedMedia.filter(media => media && media.type === 'video');
    console.log('🎬 videoMedia memoized:', videos.length, 'videos');
    return videos;
  }, [capturedMedia]);

  // Check if we can save whenever capturedMedia changes
  useEffect(() => {
    const photosExist = photoMedia.length > 0;
    const videosExist = videoMedia.length > 0;
    
    console.log('Media status check:', {
      photoMediaLength: photoMedia.length,
      videoMediaLength: videoMedia.length,
      photosExist,
      videosExist,
      canSave: photosExist && videosExist,
      existingMediaStatus
    });
    
    setCanSave(photosExist && videosExist);
  }, [capturedMedia, photoMedia.length, videoMedia.length, existingMediaStatus]);

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

      console.info('capturedMedia', capturedMedia);

      showSuccess('Success', 'Media captured and saved successfully!');
      
      // Call the callback with media data before navigating back
      if (onMediaSaved) {
        // Use current media state directly instead of state variables
        const currentHasPhotos = photoMedia.length > 0;
        const currentHasVideo = videoMedia.length > 0;
        
        const mediaData = {
          deliveryLineId: itemDetail.DeliveryLineId,
          hasPhotos: currentHasPhotos,
          hasVideo: currentHasVideo,
          itemNumber: itemDetail.ItemNumber,
          capturedMedia
        };
        console.log('Calling onMediaSaved with:', mediaData);
        onMediaSaved(mediaData);
      }
      
      // Navigate back to items page
      navigation.goBack();
    } catch (error) {
      console.error('Error saving media:', error);
      showError('Error', 'Failed to save media');
    }
  }, [canSave, itemDetail.DeliveryLineId, itemDetail.ItemNumber, capturedMedia, photoMedia.length, videoMedia.length, navigation, showSuccess, showError, onMediaSaved]);

  const handleBackToItems = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  // Dynamic tabs configuration with enhanced visual indicators
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
            key={`photos-${existingMedia?.filter(m => m && m.type === 'photo').length || 0}`}
            mediaType="photo"
            maxPhotos={10}
            onMediaCaptured={handlePhotoCaptured}
            onMediaRemoved={handleMediaRemoved}
            existingMedia={existingMedia?.filter(m => m && m.type === 'photo') || []}
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
            key={`videos-${existingMedia?.filter(m => m && m.type === 'video').length || 0}`}
            mediaType="video"
            maxVideos={5}
            onMediaCaptured={handleVideoCaptured}
            onMediaRemoved={handleMediaRemoved}
            existingMedia={existingMedia?.filter(m => m && m.type === 'video') || []}
            style={styles.mediaCaptureArea}
          />
        </View>
      )
    }
  ], [activeTab, existingMedia, handlePhotoCaptured, handleVideoCaptured, handleMediaRemoved]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <AppHeader 
        title={`Pick Slip #${itemDetail.ItemNumber}`}
        leftElement={
          <HeaderButton
            icon="back"
            onPress={handleBackToItems}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
        }
        rightElement={
          <HeaderButton
            icon="home"
            onPress={handleNavigateToDashboard}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
        }
      />

      {/* Item Details with Enhanced Spacing */}
      <View style={styles.itemDetailsContainer}>
        <ItemDetailsCard
          itemNumber={itemDetail.ItemNumber}
          itemDescription={itemDetail.ItemDesc}
          qtyRequested={itemDetail.QtyRequested}
          qtyPicked={itemDetail.QtyPicked}
          itemUom={itemDetail.ItemUom}
        />
      </View>

      {/* Dynamic Media Tabs with Enhanced Visual Indicators */}
      <View style={styles.tabsContainer}>
        <DynamicTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeIconStyle={styles.activeTabIcon}
          activeLabelStyle={styles.activeTabLabel}
        />
      </View>

      {/* Enhanced Save Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          title="Save & Continue"
          onPress={handleSave}
          style={canSave ? styles.saveButton : styles.disabledButton}
          textStyle={styles.saveButtonText}
          disabled={!canSave}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoadToDockItemDetailsScreen;
