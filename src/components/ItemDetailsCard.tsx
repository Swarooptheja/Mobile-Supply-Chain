import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
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
  const styles = createItemDetailsCardStyles(theme);

  return (
    <View style={[styles.itemDetailsCard, style]}>
      {/* Item Information Section */}
      <View style={styles.itemInfoSection}>
        <Text style={styles.itemIdentifier}>
          {itemNumber}
        </Text>
        <Text style={styles.itemDescription}>{itemDescription}</Text>
      </View>
      
      {/* Quantity Section */}
      <View style={styles.quantitySection}>
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>Requested Qty:</Text>
          <Text style={styles.quantityValue}>{qtyRequested} {itemUom}</Text>
        </View>
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>Loaded Qty:</Text>
          <View style={styles.loadedQuantityRow}>
            <Text style={styles.quantityValue}>{qtyPicked}</Text>
            <Text style={styles.quantityLabel}> of {qtyRequested} {itemUom}</Text>
            {/* Status indicator */}
            {Number(qtyPicked) === Number(qtyRequested) ? (
              <Text style={styles.statusIndicator}>✅</Text>
            ) : (
              <Text style={styles.statusIndicator}>⚠️</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemDetailsCard;
