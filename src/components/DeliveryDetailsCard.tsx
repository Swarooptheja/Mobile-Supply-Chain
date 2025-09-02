import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DeliveryDetailsCardProps {
  salesOrderNumber: string;
  customerName: string;
  itemCount: number;
  date: string;
}

export const DeliveryDetailsCard: React.FC<DeliveryDetailsCardProps> = ({
  salesOrderNumber,
  customerName,
  itemCount,
  date
}) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <View style={styles.leftDetails}>
        <Text style={styles.salesOrderNumber}>SO# {salesOrderNumber}</Text>
        <Text style={styles.customerName}>{customerName}</Text>
        <Text style={styles.totalItems}>Total Items: {itemCount}</Text>
      </View>
      <View style={styles.dateSection}>
        <Text style={styles.dateLabel}>DATE</Text>
        <Text style={styles.dateValue}>{date}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftDetails: {
    flex: 1,
  },
  salesOrderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  customerName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  totalItems: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
});
