import React, { memo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { ILoadToDockItem } from '../types/loadToDock.interface';

interface LoadToDockItemProps {
  item: ILoadToDockItem;
  index: number;
  onPress: (item: ILoadToDockItem) => void;
}

const LoadToDockItem: React.FC<LoadToDockItemProps> = memo(({ item, index, onPress }) => {
  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity
      style={[
        styles.loadItemCard,
        item.status === 'in-progress' && styles.inProgressCard,
        item.status === 'completed' && styles.completedCard
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.deliveryIdContainer}>
          <Text style={styles.deliveryId}>{item.deliveryId}</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{item.itemCount} Items</Text>
          </View>
        </View>
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.status === 'pending' ? '#f59e0b' : item.status === 'in-progress' ? '#3b82f6' : '#10b981' }
          ]} />
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.label}>SO# {item.salesOrderNumber}</Text>
          <Text style={styles.value}>{item.customerName}</Text>
          <Text style={styles.label}>Trip#</Text>
          <Text style={styles.value}>{item.tripNumber}</Text>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{item.date}</Text>
          <Text style={styles.label}>Dock</Text>
          <Text style={styles.value}>{item.dock}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  loadItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  inProgressCard: {
    borderLeftColor: '#3b82f6',
  },
  completedCard: {
    borderLeftColor: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  itemCountBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemCountText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default LoadToDockItem;
