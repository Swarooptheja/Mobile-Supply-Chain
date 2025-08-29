import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VectorIcon, CommonIcon, CommonIcons } from './VectorIcon';

/**
 * Example component demonstrating how to use the VectorIcon system
 * This shows different ways to use icons throughout the application
 */
export const VectorIconExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VectorIcon Usage Examples</Text>
      
      {/* Using CommonIcon for common icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Icons (Recommended)</Text>
        <View style={styles.iconRow}>
          <CommonIcon icon="back" size={24} color="#007AFF" />
          <CommonIcon icon="home" size={24} color="#34C759" />
          <CommonIcon icon="search" size={24} color="#FF9500" />
          <CommonIcon icon="refresh" size={24} color="#5856D6" />
          <CommonIcon icon="qrCode" size={24} color="#FF2D92" />
        </View>
      </View>

      {/* Using VectorIcon with specific icon sets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specific Icon Sets</Text>
        <View style={styles.iconRow}>
          <VectorIcon name="heart" size={24} color="#FF3B30" iconSet="MaterialIcons" />
          <VectorIcon name="star" size={24} color="#FFD700" iconSet="FontAwesome" />
          <VectorIcon name="check-circle" size={24} color="#34C759" iconSet="Feather" />
          <VectorIcon name="alert-circle" size={24} color="#FF9500" iconSet="Ionicons" />
          <VectorIcon name="user" size={24} color="#007AFF" iconSet="AntDesign" />
        </View>
      </View>

      {/* Using different icon sets for the same concept */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Same Icon, Different Sets</Text>
        <View style={styles.iconRow}>
          <Text style={styles.iconLabel}>Home:</Text>
          <VectorIcon name="home" size={20} color="#007AFF" iconSet="MaterialIcons" />
          <VectorIcon name="home" size={20} color="#007AFF" iconSet="FontAwesome" />
          <VectorIcon name="home" size={20} color="#007AFF" iconSet="Feather" />
          <VectorIcon name="home" size={20} color="#007AFF" iconSet="Ionicons" />
        </View>
      </View>

      {/* Available common icons reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Common Icons</Text>
        <Text style={styles.description}>
          Available keys: {Object.keys(CommonIcons).join(', ')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default VectorIconExample;
