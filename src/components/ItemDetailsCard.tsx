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

const styles = StyleSheet.create({
  itemDetailsCard: {
    backgroundColor: '#ffffff',
    margin: 0, // Remove margin since parent handles spacing
    padding: 12, // Further reduced padding to make card shorter
    borderRadius: 12, // Reduced border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Reduced shadow
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0,
    flexDirection: 'column', // Single column layout for better readability
    // Add gradient-like effect with multiple borders
    borderTopWidth: 3, // Reduced border width
    borderTopColor: '#3B82F6',
    borderLeftWidth: 3, // Reduced border width
    borderLeftColor: '#3B82F6',
  },
  itemInfoSection: {
    marginBottom: 8, // Further reduced margin to make card shorter
  },
  itemIdentifier: {
    fontSize: 18, // Reduced from 24 to 18
    fontWeight: '800', // Reduced from 900 to 800
    color: '#1f2937',
    marginBottom: 4, // Further reduced margin to make card shorter
    letterSpacing: 0.3, // Reduced letter spacing
    textShadowColor: 'rgba(0, 0, 0, 0.05)', // Reduced shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  itemDescription: {
    fontSize: 14, // Reduced from 16 to 14
    color: '#374151',
    fontWeight: '500', // Reduced from 600 to 500
    lineHeight: 18, // Reduced line height
    letterSpacing: 0.1, // Reduced letter spacing
  },
  quantitySection: {
    gap: 6, // Further reduced gap
    backgroundColor: '#F8FAFC',
    borderRadius: 8, // Reduced border radius
    padding: 8, // Further reduced padding to make card shorter
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6, // Reduced gap
    minHeight: 20, // Reduced min height
  },
  quantityLabel: {
    fontSize: 12, // Reduced from 14 to 12
    color: '#374151',
    fontWeight: '500', // Reduced from 600 to 500
    flexShrink: 0, // Prevent shrinking to avoid wrapping
    minWidth: 90, // Reduced min width
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3, // Reduced gap
    flex: 1,
    justifyContent: 'flex-end',
  },
  quantityValue: {
    fontSize: 13, // Reduced from 16 to 13
    color: '#1e3a8a',
    fontWeight: '700', // Reduced from 800 to 700
    letterSpacing: 0.1, // Reduced letter spacing
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6, // Reduced padding
    paddingVertical: 2, // Reduced padding
    borderRadius: 4, // Reduced border radius
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  statusIndicator: {
    fontSize: 12, // Reduced from 16 to 12
    marginLeft: 2, // Reduced margin
  },
});

export default ItemDetailsCard;
