import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createOrganizationScreenStyles } from '../styles/OrganizationScreen.styles';

interface OrganizationEmptyStateProps {
  searchText: string;
  loading: boolean;
  refreshing: boolean;
  isInitialLoad: boolean;
}

const OrganizationEmptyState: React.FC<OrganizationEmptyStateProps> = memo(({ 
  searchText, 
  loading, 
  refreshing, 
  isInitialLoad 
}) => {
  const theme = useTheme();
  const styles = createOrganizationScreenStyles(theme);
  
  // Don't show empty state while loading or refreshing
  if (loading || refreshing || isInitialLoad) return null;
  
  if (searchText) {
    return (
      <View style={styles.noResultsContainer}>
        <View style={styles.noResultsIcon}>
          <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>🔍</Text>
        </View>
        <Text style={styles.noResultsText}>No organizations found</Text>
        <Text style={styles.noResultsSubtext}>
          Try adjusting your search terms or check your spelling
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Text style={{ fontSize: 32, color: theme.colors.textSecondary }}>🏢</Text>
      </View>
      <Text style={styles.emptyStateText}>No organizations available</Text>
      <Text style={styles.emptyStateSubtext}>
        Pull down to refresh and load organizations from the server
      </Text>
    </View>
  );
});

OrganizationEmptyState.displayName = 'OrganizationEmptyState';

export default OrganizationEmptyState;
