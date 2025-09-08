import React, { memo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { TransactionHistoryStats } from '../services/transactionHistoryService';
import { createStatusFilterStyles } from '../styles/StatusFilter.styles';

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'all';

interface StatusFilterProps {
  selectedStatus: TransactionStatus;
  stats: TransactionHistoryStats | null;
  theme: Theme;
  isTablet?: boolean;
  isDesktop?: boolean;
  onStatusChange: (status: TransactionStatus) => void;
  testID?: string;
}

const StatusFilter: React.FC<StatusFilterProps> = memo(({
  selectedStatus,
  stats,
  theme,
  isTablet = false,
  isDesktop = false,
  onStatusChange,
  testID
}) => {
  const styles = createStatusFilterStyles(theme, isTablet, isDesktop);

  const getStatusCount = (status: TransactionStatus): number => {
    if (!stats) return 0;
    
    // Debug logging to help identify count issues
    if (__DEV__) {
      console.log('StatusFilter - Stats received:', stats);
      console.log('StatusFilter - Requested status:', status);
    }
    
    switch (status) {
      case 'all':
        return stats.total;
      case 'pending':
        return stats.pending;
      case 'success':
        return stats.success;
      case 'failed':
        return stats.failed;
      default:
        return 0;
    }
  };

  const filterOptions = [
    { key: 'all' as TransactionStatus, label: 'All', count: getStatusCount('all') },
    { key: 'pending' as TransactionStatus, label: 'Pending', count: getStatusCount('pending') },
    { key: 'success' as TransactionStatus, label: 'Success', count: getStatusCount('success') },
    { key: 'failed' as TransactionStatus, label: 'Failed', count: getStatusCount('failed') }
  ];

  return (
    <View style={styles.filterContainer} testID={testID}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {filterOptions.map((filter) => {
          const isActive = selectedStatus === filter.key;
          
          return (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive
              ]}
              onPress={() => onStatusChange(filter.key)}
              activeOpacity={0.7}
              testID={`filter-${filter.key}`}
            >
              <Text style={[
                styles.filterButtonText,
                isActive && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
              <View style={[
                styles.filterBadge,
                isActive && styles.filterBadgeActive
              ]}>
                <Text style={[
                  styles.filterBadgeText,
                  isActive && styles.filterBadgeTextActive
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

StatusFilter.displayName = 'StatusFilter';

export default StatusFilter;
