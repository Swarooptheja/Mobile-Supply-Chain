import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { createItemDetailsCardStyles } from '../styles/ItemDetailsCard.styles';

export interface IItemDetailsCardProps {
  // itemId: string;
  itemNumber: string;
  itemDescription: string;
  qtyRequested: string;
  qtyPicked: string;
  itemUom: string;
  style?: any;
}

/**
 * Reusable component for displaying item details in a card format
 * Can be used across different detail pages for consistent item information display
 */
const ItemDetailsCard: React.FC<IItemDetailsCardProps> = ({
  // itemId,
  itemNumber,
  itemDescription,
  qtyRequested,
  qtyPicked,
  itemUom,
  style
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createItemDetailsCardStyles(theme);

  return (
    <View style={[styles.itemDetailsCard, style]}>
      {/* Item Number Tag */}
      <View style={styles.itemTagContainer}>
        <Text style={styles.itemTag}>{itemNumber}</Text>
      </View>
      
      {/* Item Description */}
      <Text style={styles.itemDescription}>{itemDescription}</Text>
      
      {/* Quantity Section - Two Columns */}
      <View style={styles.quantitySection}>
        {/* Left Column - Requested */}
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>{t('loadToDock.requested')}:</Text>
          <Text style={styles.quantityValue}>{qtyRequested} {itemUom}</Text>
        </View>
        
        {/* Right Column - Loaded */}
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>{t('loadToDock.loaded')}:</Text>
          <View style={styles.loadedQuantityRow}>
            <Text style={styles.quantityInput}>{qtyPicked}</Text>
            <Text style={styles.quantityLabel}> {t('ui.of')} {qtyRequested} {itemUom}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemDetailsCard;
