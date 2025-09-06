import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { loadToDockService } from '../services/loadToDockService';
import { ILoadToDockItemDetail } from '../types/loadToDock.interface';
import { IMediaItem } from '../types/media.interface';

interface UseLoadToDockItemsProps {
  deliveryId: string;
  onError: (title: string, message: string) => void;
}

interface MediaStatus {
  hasPhotos: boolean;
  hasVideo: boolean;
  capturedMedia: IMediaItem[];
}

export function useLoadToDockItems({ deliveryId, onError }: UseLoadToDockItemsProps) {
  const [items, setItems] = useState<ILoadToDockItemDetail[]>([]);
  const [filteredItems, setFilteredItems] = useState<ILoadToDockItemDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use ref to store media status updates that persist across re-renders
  const mediaStatusRef = useRef<Map<string, MediaStatus>>(new Map());
  // Use ref to track original items for search reset
  const originalItemsRef = useRef<ILoadToDockItemDetail[]>([]);
  // Use ref to track if data has been loaded to prevent repeated loading
  const dataLoadedRef = useRef<boolean>(false);

  // Reset data loaded flag when deliveryId changes
  useEffect(() => {
    dataLoadedRef.current = false;
  }, [deliveryId]);

  // Load items when screen comes into focus, but only once
  useFocusEffect(
    useCallback(() => {
      // Only load data if it hasn't been loaded yet
      if (dataLoadedRef.current) {
        return;
      }

      const loadItems = async () => {
        setIsLoading(true);
        try {
          const data = await loadToDockService.getItemsByDeliveryId(deliveryId);
          // console.log('Loading items, count:', data.length);
          
          // Merge with existing media status to preserve updates
          const mergedData = data.map(newItem => {
            const storedMediaStatus = mediaStatusRef.current.get(newItem.DeliveryLineId);
            if (storedMediaStatus) {
              // console.log(`🎬 Restoring media status for ${newItem.ItemNumber}:`, storedMediaStatus);
              return { ...newItem, mediaData: storedMediaStatus };
            }
            return newItem;
          });
          
          setItems(mergedData);
          setFilteredItems(mergedData);
          originalItemsRef.current = mergedData;
          dataLoadedRef.current = true; // Mark data as loaded
        } catch (serviceError) {
          // console.log('Service not available, keeping existing data');
        } finally {
          setIsLoading(false);
        }
      };

      loadItems();
    }, [deliveryId])
  );

  // Search items with debouncing
  const searchItems = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setFilteredItems(originalItemsRef.current);
      return;
    }

    try {
      setIsLoading(true);
      const searchResults = await loadToDockService.searchItemsByDeliveryId(deliveryId, searchQuery);
      // console.log('Search results count:', searchResults.length);
      setFilteredItems(searchResults);
    } catch (error) {
      console.error('Error searching items:', error);
      onError('Search Error', 'Failed to search items');
    } finally {
      setIsLoading(false);
    }
  }, [deliveryId, onError]);

  // Update media status for an item
  const updateItemMediaStatus = useCallback((deliveryLineId: string, hasPhotos: boolean, hasVideo: boolean, capturedMedia: IMediaItem[]) => {
    // console.log(`🎬 Updating media status for ${deliveryLineId}:`, { hasPhotos, hasVideo, capturedMediaCount: capturedMedia.length });
    
    // Store in ref for persistence across re-renders
    mediaStatusRef.current.set(deliveryLineId, { hasPhotos, hasVideo, capturedMedia });
    
    const updateFunction = (prevItems: ILoadToDockItemDetail[]) => {
      const updatedItems = prevItems.map(item => 
        item.DeliveryLineId === deliveryLineId
          ? { ...item, mediaData: { hasPhotos, hasVideo, capturedMedia } }
          : item
      );
      
      // console.log(`🎬 Updated items for ${deliveryLineId}:`, updatedItems.find(item => item.DeliveryLineId === deliveryLineId));
      return updatedItems;
    };

    setItems(updateFunction);
    setFilteredItems(updateFunction);
    // Update the original items ref as well
    originalItemsRef.current = updateFunction(originalItemsRef.current);
  }, []);

  // Update item quantity
  const updateItemQuantity = useCallback((deliveryLineId: string, newQuantity: number) => {
    // console.log(`🔢 Updating quantity for ${deliveryLineId}:`, { newQuantity });
    
    const updateFunction = (prevItems: ILoadToDockItemDetail[]) => 
      prevItems.map(i => 
        i.DeliveryLineId === deliveryLineId 
          ? { ...i, QtyPicked: newQuantity.toString() }
          : i
      );

    setItems(updateFunction);
    setFilteredItems(updateFunction);
    // Update the original items ref as well
    originalItemsRef.current = updateFunction(originalItemsRef.current);
    
    // console.log(`🔢 Updated quantity for ${deliveryLineId}:`, newQuantity.toString());
  }, []);

  // Get current media status for an item
  const getItemMediaStatus = useCallback((item: ILoadToDockItemDetail): MediaStatus | undefined => {
    if (item.mediaData) {
      return {
        hasPhotos: item.mediaData.hasPhotos,
        hasVideo: item.mediaData.hasVideo,
        capturedMedia: item.mediaData.capturedMedia || []
      };
    }
    return mediaStatusRef.current.get(item.DeliveryLineId);
  }, []);

  // Scan item by barcode
  const scanItem = useCallback(async (barcode: string) => {
    try {
      const searchResults = await loadToDockService.scanItemsByDeliveryId(deliveryId, barcode);
      return searchResults;
    } catch (error) {
      console.error('Error searching scanned item:', error);
      onError('Scan Error', 'Failed to process scanned barcode');
      return [];
    }
  }, [deliveryId, onError]);

  return {
    items,
    filteredItems,
    isLoading,
    searchItems,
    updateItemMediaStatus,
    updateItemQuantity,
    getItemMediaStatus,
    scanItem,
  };
}
