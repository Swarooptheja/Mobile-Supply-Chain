import { useMemo } from 'react';
import { ILoadToDockItemDetail } from '../types/loadToDock.interface';

export const useLoadToDockValidation = (
  items: ILoadToDockItemDetail[],
  vehicleNumber: string
) => {
  return useMemo(() => {
    if (items.length === 0) {
      return false;
    }
    
    // Check if ANY item has media (photos AND video)
    const anyItemHasMedia = items.some(item => {
      // Check if item has mediaData with photos and video
      if (item.mediaData) {
        const hasMedia = item.mediaData.hasPhotos && item.mediaData.hasVideo;
        if (__DEV__) {
          console.log(`📱 Item ${item.ItemNumber} media check:`, {
            deliveryLineId: item.DeliveryLineId,
            mediaData: item.mediaData,
            hasMedia
          });
        }
        return hasMedia;
      }
      // Fallback to old hasPhotos/hasVideo properties
      const hasMedia = item.hasPhotos && item.hasVideo;
      if (__DEV__) {
        console.log(`📱 Item ${item.ItemNumber} fallback media check:`, {
          deliveryLineId: item.DeliveryLineId,
          hasPhotos: item.hasPhotos,
          hasVideo: item.hasVideo,
          hasMedia
        });
      }
      return hasMedia;
    });
    
    // Check if ANY item has quantity > 0
    const anyItemHasQuantity = items.some(item => {
      const qtyPicked = Number(item.QtyPicked) || 0;
      return qtyPicked > 0;
    });
    
    const vehicleEntered = vehicleNumber.trim().length > 0;
    
    const canLoadToDock = anyItemHasMedia && anyItemHasQuantity && vehicleEntered;
    
    if (__DEV__) {
      console.log('🔍 Load to Dock Requirements Check:', {
        itemsCount: items.length,
        anyItemHasMedia,
        anyItemHasQuantity,
        vehicleEntered,
        canLoadToDock,
        vehicleNumber: vehicleNumber.trim(),
        items: items.map(item => {
          const hasPhotos = item.mediaData?.hasPhotos || item.hasPhotos;
          const hasVideo = item.mediaData?.hasVideo || item.hasVideo;
          const qtyPicked = Number(item.QtyPicked) || 0;
          const hasMedia = hasPhotos && hasVideo;
          const hasQuantity = qtyPicked > 0;
          
          return {
            itemNumber: item.ItemNumber,
            hasMediaData: !!item.mediaData,
            hasPhotos,
            hasVideo,
            hasMedia,
            qtyPicked: item.QtyPicked,
            qtyPickedNumber: qtyPicked,
            hasQuantity,
            meetsRequirements: hasMedia && hasQuantity
          };
        })
      });
    }
    
    return canLoadToDock;
  }, [items, vehicleNumber]);
};
