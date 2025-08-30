import React, { memo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createOrganizationScreenStyles } from '../styles/OrganizationScreen.styles';

interface OrganizationListFooterProps {
  loading: boolean;
}

const OrganizationListFooter: React.FC<OrganizationListFooterProps> = memo(({ loading }) => {
  const theme = useTheme();
  const styles = createOrganizationScreenStyles(theme);
  
  if (!loading) return null;
  
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading more organizations...</Text>
    </View>
  );
});

OrganizationListFooter.displayName = 'OrganizationListFooter';

export default OrganizationListFooter;
