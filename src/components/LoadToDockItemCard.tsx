import React, { memo, useCallback } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { CommonIcon } from './index';
import { ILoadToDockItemDetail } from '../types/loadToDock.interface';
import { useTranslation } from '../hooks/useTranslation';

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
    // Reference design styles
    pillTag: ViewStyle;
    pillText: TextStyle;
    quantitySection: ViewStyle;
    quantityValue: TextStyle;
    mediaTabsContainer: ViewStyle;
    mediaTab: ViewStyle;
    pendingTab: ViewStyle;
    completedTab: ViewStyle;
    mediaTabText: TextStyle;
    completedTabText: TextStyle;
    // New styles for reference design
    referenceCard: ViewStyle;
    referenceHeader: ViewStyle;
    referenceItemNumber: TextStyle;
    referenceArrow: ViewStyle;
    referenceDescription: TextStyle;
    referenceQuantitySection: ViewStyle;
    referenceQuantityRow: ViewStyle;
    referenceQuantityLabel: TextStyle;
    referenceQuantityValue: TextStyle;
    referenceQuantityInput: ViewStyle;
    referenceActionButtons: ViewStyle;
    referenceActionButton: ViewStyle;
    referenceActionButtonPending: ViewStyle;
    referenceActionButtonCompleted: ViewStyle;
    referenceActionButtonText: TextStyle;
    referenceActionButtonIcon: ViewStyle;
    // New styles for Figma design
    itemIdContainer: ViewStyle;
    itemIdText: TextStyle;
    quantityColumn: ViewStyle;
    loadedQuantityContainer: ViewStyle;
    quantityOfText: TextStyle;
    pendingButtonText: TextStyle;
    completedButtonText: TextStyle;
    figmaQuantityRow: ViewStyle;
    figmaQuantityLabel: TextStyle;
    figmaQuantityValue: TextStyle;
  };
  onItemPress: (item: ILoadToDockItemDetail) => void;
  onQuantityChange: (deliveryLineId: string, newQuantity: number) => void;
  onQuantityError: (title: string, message: string) => void;
}

const LoadToDockItemCard: React.FC<LoadToDockItemCardProps> = memo(({
  item,
  index: _index,
  styles,
  onItemPress,
  onQuantityChange,
  onQuantityError,
}) => {
  const { t } = useTranslation();
  
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
      onQuantityError(t('common.error'), t('loadToDock.quantityExceeded'));
      return;
    }
    onQuantityChange(item.DeliveryLineId, newQuantity);
  }, [item.DeliveryLineId, item.QtyRequested, onQuantityChange, onQuantityError, t]);

  const handlePress = useCallback(() => {
    onItemPress(item);
  }, [item, onItemPress]);

  return (
    <TouchableOpacity
      key={`${item.DeliveryLineId}-${hasPhotos}-${hasVideo}`}
      style={styles.referenceCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Item ID Tag */}
      <View style={styles.itemIdContainer}>
        <Text style={styles.itemIdText}>{item.ItemNumber}</Text>
      </View>
      
      {/* Item description */}
      <Text style={styles.referenceDescription}>{item.ItemDesc}</Text>
      
      {/* Quantity section - Two column layout */}
      <View style={styles.referenceQuantitySection}>
        <View style={styles.figmaQuantityRow}>
          {/* Left column - Requested */}
          <View style={styles.quantityColumn}>
            <Text style={styles.figmaQuantityLabel}>{t('loadToDock.requested')}:</Text>
            <Text style={styles.figmaQuantityValue}>{item.QtyRequested} {item.ItemUom}</Text>
          </View>
          
          {/* Right column - Loaded */}
          <View style={styles.quantityColumn}>
            <Text style={styles.figmaQuantityLabel}>{t('loadToDock.loaded')}:</Text>
            <View style={styles.loadedQuantityContainer}>
              <TextInput
                style={styles.referenceQuantityInput}
                value={item.QtyPicked || "0"}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={styles.quantityOfText}> {t('ui.of')} {item.QtyRequested} {item.ItemUom}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Action buttons at bottom */}
      <View style={styles.referenceActionButtons}>
        <TouchableOpacity style={[
          styles.referenceActionButton,
          hasPhotos ? styles.referenceActionButtonCompleted : styles.referenceActionButtonPending
        ]}>
          <CommonIcon 
            icon="camera"
            size={25} 
            color={hasPhotos ? "#10B981" : "#1e3a8a"}
          />
          <Text style={[
            styles.referenceActionButtonText,
            hasPhotos ? styles.completedButtonText : styles.pendingButtonText
          ]}>
            {t('loadToDock.photos')} {hasPhotos ? t('loadToDock.uploaded') : t('loadToDock.pending')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[
          styles.referenceActionButton,
          hasVideo ? styles.referenceActionButtonCompleted : styles.referenceActionButtonPending
        ]}>
          <CommonIcon 
            icon="video"
            size={25} 
            color={hasVideo ? "#10B981" : "#1e3a8a"}
          />
          <Text style={[
            styles.referenceActionButtonText,
            hasVideo ? styles.completedButtonText : styles.pendingButtonText
          ]}>
            {t('loadToDock.videos')} {hasVideo ? t('loadToDock.uploaded') : t('loadToDock.pending')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

LoadToDockItemCard.displayName = 'LoadToDockItemCard';

export default LoadToDockItemCard;
