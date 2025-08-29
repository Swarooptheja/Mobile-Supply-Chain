import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  return (
    <View style={[styles.itemDetailsCard, style]}>
      <Text style={styles.itemIdentifier}>
         {itemNumber}
      </Text>
      <Text style={styles.itemDescription}>{itemDescription}</Text>
      
      <View style={styles.quantitySection}>
        <Text style={styles.quantityLabel}>
          Requested Qty: {qtyRequested} {itemUom}
        </Text>
        <View style={styles.loadedQuantityRow}>
          <Text style={styles.quantityLabel}>Loaded Qty: </Text>
          <Text style={styles.quantityValue}>{qtyPicked}</Text>
          <Text style={styles.quantityLabel}> of {qtyRequested} {itemUom}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemDetailsCard: {
    backgroundColor: '#ffffff',
    margin: 12,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemIdentifier: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 16,
  },
  quantitySection: {
    gap: 4,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '600',
    marginHorizontal: 4,
  },
});

export default ItemDetailsCard;
