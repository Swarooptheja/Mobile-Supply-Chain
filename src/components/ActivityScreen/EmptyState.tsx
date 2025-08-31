import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { createEmptyStateStyles } from '../../styles/ActivityScreen.styles';

export const EmptyState: React.FC = () => {
  const styles = createEmptyStateStyles();
  
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconContainer}>
        <VectorIcon
          name="cloud-sync"
          iconSet="MaterialIcons"
          size={48}
          color="#94A3B8"
        />
      </View>
      <Text style={styles.emptyStateTitle}>No APIs to Process</Text>
      <Text style={styles.emptyStateMessage}>
        No APIs found for the selected responsibilities. Please check your configuration or contact your administrator.
      </Text>
      <View style={styles.emptyStateTip}>
        <VectorIcon
          name="info"
          iconSet="MaterialIcons"
          size={14}
          color="#94A3B8"
        />
        <Text style={styles.tipText}>
          Make sure you have the correct responsibilities assigned to your account
        </Text>
      </View>
    </View>
  );
};
