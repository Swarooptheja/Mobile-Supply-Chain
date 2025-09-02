import { useCallback } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { ILoadToDockItemDetail } from '../types/loadToDock.interface';
import { IMediaItem } from '../types/media.interface';

interface NavigationHandlersProps {
  navigation: NavigationProp<any>;
  deliveryItem: any;
  updateItemMediaStatus: (deliveryLineId: string, hasPhotos: boolean, hasVideo: boolean, capturedMedia: IMediaItem[]) => void;
  showSuccess: (title: string, message: string) => void;
  getItemMediaStatus: (item: ILoadToDockItemDetail) => any;
}

export function useNavigationHandlers({
  navigation,
  deliveryItem,
  updateItemMediaStatus,
  showSuccess,
  getItemMediaStatus,
}: NavigationHandlersProps) {
  
  const createMediaSavedCallback = useCallback((itemNumber: string) => {
    return (mediaData: any) => {
      console.log('📱 Media saved callback:', mediaData);
      if (mediaData && mediaData.deliveryLineId) {
        const hasPhotos = Boolean(mediaData.hasPhotos);
        const hasVideo = Boolean(mediaData.hasVideo);
        console.log('📱 Processing media data:', {
          deliveryLineId: mediaData.deliveryLineId,
          hasPhotos,
          hasVideo,
          capturedMedia: mediaData.capturedMedia
        });
        updateItemMediaStatus(
          mediaData.deliveryLineId,
          hasPhotos,
          hasVideo,
          mediaData.capturedMedia
        );
        showSuccess('Media Saved', `Media captured for item ${mediaData.itemNumber || itemNumber}`);
      } else {
        console.error('Invalid mediaData received:', mediaData);
      }
    };
  }, [updateItemMediaStatus, showSuccess]);

  const navigateToItemDetails = useCallback((item: ILoadToDockItemDetail) => {
    const currentMediaStatus = getItemMediaStatus(item);
    
    console.log('🎬 handleItemPress - Item:', item.ItemNumber);
    console.log('🎬 handleItemPress - Current media status:', currentMediaStatus);
    console.log('🎬 handleItemPress - Existing media to pass:', currentMediaStatus?.capturedMedia || []);
    
    navigation.navigate('LoadToDockItemDetails', {
      deliveryItem,
      itemDetail: item,
      existingMediaStatus: currentMediaStatus,
      existingMedia: currentMediaStatus?.capturedMedia || [],
      onMediaSaved: createMediaSavedCallback(item.ItemNumber)
    });
  }, [navigation, deliveryItem, getItemMediaStatus, createMediaSavedCallback]);

  const handleBackToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  return {
    navigateToItemDetails,
    handleBackToDashboard,
    createMediaSavedCallback,
  };
}
