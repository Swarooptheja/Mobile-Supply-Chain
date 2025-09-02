import React, { memo, useCallback } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { CommonIcon, MediaStatusChip } from './index';
import { ILoadToDockItemDetail } from '../types/loadToDock.interface';

interface LoadToDockItemCardProps {
  item: ILoadToDockItemDetail;
  index: number;
  styles: {
    itemCard: ViewStyle;
    completedItemCard: ViewStyle;
    itemHeader: ViewStyle;
    itemId: TextStyle;
    arrowButton: ViewStyle;
    itemDescription: TextStyle;
    quantityRow: ViewStyle;
    quantityLabel: TextStyle;
    loadedQuantityRow: ViewStyle;
    quantityInput: ViewStyle;
    mediaStatus: ViewStyle;
  };
  onItemPress: (item: ILoadToDockItemDetail) => void;
  onQuantityChange: (deliveryLineId: string, newQuantity: number) => void;
  onQuantityError: (title: string, message: string) => void;
}

const LoadToDockItemCard: React.FC<LoadToDockItemCardProps> = memo(({
  item,
  index,
  styles,
  onItemPress,
  onQuantityChange,
  onQuantityError,
}) => {
  // Determine media status from mediaData or fallback to old properties
  const hasPhotos = item.mediaData ? item.mediaData.hasPhotos : (item.hasPhotos || false);
  const hasVideo = item.mediaData ? item.mediaData.hasVideo : (item.hasVideo || false);
  const isCompleted = hasPhotos && hasVideo;
  
  // Debug logging for media status (only in development)
  if (__DEV__) {
    console.log(`🎬 Item ${item.ItemNumber} media status:`, {
      deliveryLineId: item.DeliveryLineId,
      mediaData: item.mediaData,
      hasPhotos,
      hasVideo,
      isCompleted,
      qtyPicked: item.QtyPicked
    });
  }

  const handleQuantityChange = useCallback((text: string) => {
    const newQuantity = parseInt(text, 10) || 0;
    if (newQuantity > Number(item.QtyRequested)) {
      onQuantityError('Error', 'Loaded quantity cannot exceed requested quantity');
      return;
    }
    onQuantityChange(item.DeliveryLineId, newQuantity);
  }, [item.DeliveryLineId, item.QtyRequested, onQuantityChange, onQuantityError]);

  const handlePress = useCallback(() => {
    onItemPress(item);
  }, [item, onItemPress]);

  return (
    <TouchableOpacity
      key={`${item.DeliveryLineId}-${hasPhotos}-${hasVideo}`}
      style={[
        styles.itemCard,
        isCompleted && styles.completedItemCard
      ]}
      onPress={handlePress}
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
          value={item.QtyPicked || "0"}
          onChangeText={handleQuantityChange}
          keyboardType="numeric"
          placeholder="0"
        />
        <Text style={styles.quantityLabel}> of {item.QtyRequested} {item.ItemUom}</Text>
      </View>
      
      <View style={styles.mediaStatus}>
        <MediaStatusChip
          type="photos"
          status={hasPhotos ? 'completed' : 'pending'}
        />
        <MediaStatusChip
          type="video"
          status={hasVideo ? 'completed' : 'pending'}
        />
      </View>
    </TouchableOpacity>
  );
});

LoadToDockItemCard.displayName = 'LoadToDockItemCard';

export default LoadToDockItemCard;
