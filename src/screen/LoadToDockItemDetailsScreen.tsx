import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Alert,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  AppHeader, 
  Button, 
  ItemDetailsCard, 
  HeaderButton, 
  MediaSelectionModal,
  MediaUploadSection,
  MediaPreviewGrid,
  MediaEmptyState
} from '../components';

import { LoadToDockItemDetailsScreenProps } from '../types/loadToDock.interface';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useMediaCapture } from '../hooks/useMediaCapture';
import { useMediaModals } from '../hooks/useMediaModals';
import { createLoadToDockItemDetailsScreenStyles } from '../styles/LoadToDockItemDetailsScreen.styles';
import { getHeaderColor } from '../styles/global.styles';

const LoadToDockItemDetailsScreen: React.FC<LoadToDockItemDetailsScreenProps> = ({ route, navigation }) => {
  const { itemDetail, existingMedia, onMediaSaved } = route.params;
  const { showError, showSuccess } = useAttractiveNotification();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createLoadToDockItemDetailsScreenStyles(theme);
  
  // Custom hooks for media handling
  const {
    capturedMedia,
    photoMedia,
    videoMedia,
    canSave,
    removeMedia,
    handleCameraCapture,
    handleGallerySelection,
  } = useMediaCapture({
    existingMedia,
    onError: showError,
  });

  const {
    showPhotoModal,
    showVideoModal,
    openPhotoModal,
    openVideoModal,
    closePhotoModal,
    closeVideoModal,
  } = useMediaModals();

  const handleSave = useCallback(async () => {
    try {
      if (!canSave) {
        Alert.alert('Cannot Save', 'Please capture both photos AND video to proceed');
        return;
      }

      showSuccess('Success', 'Media captured and saved successfully!');
      
      // Call the callback with media data before navigating back
      if (onMediaSaved) {
        const mediaData = {
          deliveryLineId: itemDetail.DeliveryLineId,
          hasPhotos: photoMedia.length > 0,
          hasVideo: videoMedia.length > 0,
          itemNumber: itemDetail.ItemNumber,
          capturedMedia
        };
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

  // Modal handlers
  const handlePhotoCameraPress = useCallback(() => {
    closePhotoModal();
    handleCameraCapture('photo');
  }, [closePhotoModal, handleCameraCapture]);

  const handlePhotoGalleryPress = useCallback(() => {
    closePhotoModal();
    handleGallerySelection('photo');
  }, [closePhotoModal, handleGallerySelection]);

  const handleVideoCameraPress = useCallback(() => {
    closeVideoModal();
    handleCameraCapture('video');
  }, [closeVideoModal, handleCameraCapture]);

  const handleVideoGalleryPress = useCallback(() => {
    closeVideoModal();
    handleGallerySelection('video');
  }, [closeVideoModal, handleGallerySelection]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={theme.colors.background === '#121212' ? "light-content" : "dark-content"} 
        backgroundColor={getHeaderColor()} 
      />
      
      {/* Header */}
      <AppHeader 
        title={`Pick Slip #${itemDetail.ItemNumber}`}
        leftElement={
          <HeaderButton
            icon="back"
            onPress={handleBackToItems}
            backgroundColor={'#1e3a8a'}
          />
        }
        rightElement={
          <HeaderButton
            icon="home"
            onPress={handleNavigateToDashboard}
            backgroundColor={'#1e3a8a'}
          />
        }
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Item Details Card */}
        <View style={styles.itemDetailsContainer}>
          <ItemDetailsCard
            itemNumber={itemDetail.ItemNumber}
            itemDescription={itemDetail.ItemDesc}
            qtyRequested={itemDetail.QtyRequested}
            qtyPicked={itemDetail.QtyPicked}
            itemUom={itemDetail.ItemUom}
          />
        </View>

        {/* Upload Buttons Section */}
        <MediaUploadSection
          onPhotoUpload={openPhotoModal}
          onVideoUpload={openVideoModal}
        />

        {/* Media Preview Section */}
        {capturedMedia.length > 0 ? (
          <MediaPreviewGrid
            media={capturedMedia}
            onRemove={removeMedia}
          />
        ) : (
          <MediaEmptyState />
        )}
      </ScrollView>

      {/* Photo Selection Modal */}
      <MediaSelectionModal
        visible={showPhotoModal}
        onClose={closePhotoModal}
        onCameraPress={handlePhotoCameraPress}
        onGalleryPress={handlePhotoGalleryPress}
        title="Upload Photos"
        mediaType="photo"
      />

      {/* Video Selection Modal */}
      <MediaSelectionModal
        visible={showVideoModal}
        onClose={closeVideoModal}
        onCameraPress={handleVideoCameraPress}
        onGalleryPress={handleVideoGalleryPress}
        title="Upload Videos"
        mediaType="video"
      />

      {/* Save Button */}
      <View style={[
        styles.bottomButtonContainer,
        { paddingBottom: Math.max(40, insets.bottom + 20) } // Ensures button is always visible above navigation
      ]}>
        <Button
          title="Save & Continue"
          onPress={handleSave}
          disabled={!canSave}
          size="lg"
          variant="solid"
          colorScheme="primary"
          fullWidth
          style={styles.saveButton}
          textStyle={styles.saveButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoadToDockItemDetailsScreen;
