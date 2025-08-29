import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ItemDetailsCard, IItemDetailsCardProps } from './ItemDetailsCard';

/**
 * Example component demonstrating how to use ItemDetailsCard
 * This shows different ways to implement the component across various screens
 */
const ItemDetailsCardExample: React.FC = () => {
  // Example data for demonstration
  const sampleItems: IItemDetailsCardProps[] = [
    {
      itemId: 'ITM001',
      itemNumber: 'ABC123',
      itemDescription: 'Sample Product Description for Item 1',
      qtyRequested: '100',
      qtyPicked: '75',
      itemUom: 'PCS'
    },
    {
      itemId: 'ITM002',
      itemNumber: 'XYZ789',
      itemDescription: 'Another Product with Longer Description Text',
      qtyRequested: '50',
      qtyPicked: '50',
      itemUom: 'KG'
    },
    {
      itemId: 'ITM003',
      itemNumber: 'DEF456',
      itemDescription: 'Third Product Item for Testing',
      qtyRequested: '200',
      qtyPicked: '150',
      itemUom: 'BOX'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ItemDetailsCard Usage Examples</Text>
      
      {/* Basic usage */}
      <Text style={styles.sectionTitle}>Basic Usage:</Text>
      <ItemDetailsCard
        itemId="ITM001"
        itemNumber="ABC123"
        itemDescription="Sample Product Description"
        qtyRequested="100"
        qtyPicked="75"
        itemUom="PCS"
      />

      {/* With custom styling */}
      <Text style={styles.sectionTitle}>With Custom Styling:</Text>
      <ItemDetailsCard
        itemId="ITM002"
        itemNumber="XYZ789"
        itemDescription="Product with Custom Styling"
        qtyRequested="50"
        qtyPicked="50"
        itemUom="KG"
        style={styles.customCard}
      />

      {/* Multiple items in a list */}
      <Text style={styles.sectionTitle}>Multiple Items in List:</Text>
      {sampleItems.map((item, index) => (
        <ItemDetailsCard
          key={`${item.itemId}-${index}`}
          {...item}
          style={styles.listItem}
        />
      ))}

      {/* Usage in different contexts */}
      <Text style={styles.sectionTitle}>Usage in Different Contexts:</Text>
      <Text style={styles.contextText}>
        • Load to Dock Item Details{'\n'}
        • Transaction History{'\n'}
        • Order Management{'\n'}
        • Inventory Tracking{'\n'}
        • Shipping Details
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
  },
  customCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  listItem: {
    marginBottom: 8,
  },
  contextText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 8,
  },
});

export default ItemDetailsCardExample;
