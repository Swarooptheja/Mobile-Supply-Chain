import React, { ReactNode, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View, ListRenderItem } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface RefreshConfig {
  onRefresh: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

interface PullToRefreshWrapperProps {
  children: ReactNode;
  refreshConfig: RefreshConfig;
  refreshing?: boolean;
  onRefresh?: () => void;
  showRefreshIndicator?: boolean;
  refreshIndicatorText?: string;
}

const PullToRefreshWrapper: React.FC<PullToRefreshWrapperProps> = ({
  children,
  refreshConfig: _refreshConfig,
  refreshing: _externalRefreshing,
  onRefresh: _externalOnRefresh,
  showRefreshIndicator = true,
  refreshIndicatorText = 'Refreshing from server...',
}) => {
  const theme = useTheme();
  const [refreshIndicatorVisible, _setRefreshIndicatorVisible] = useState(false);

  return (
    <View style={styles.container}>
      {showRefreshIndicator && refreshIndicatorVisible && (
        <View style={[styles.refreshIndicator, { borderBottomColor: theme.colors.separator }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.refreshText, { color: theme.colors.textSecondary }]}>
            {refreshIndicatorText}
          </Text>
        </View>
      )}
      
      {children}
    </View>
  );
};

// Enhanced FlatList with built-in pull-to-refresh
export const PullToRefreshFlatList = <T extends any>({
  data,
  renderItem,
  refreshConfig,
  refreshing: externalRefreshing,
  onRefresh: externalOnRefresh,
  showRefreshIndicator = true,
  refreshIndicatorText,
  ...flatListProps
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
  refreshConfig: RefreshConfig;
  refreshing?: boolean;
  onRefresh?: () => void;
  showRefreshIndicator?: boolean;
  refreshIndicatorText?: string;
} & Omit<React.ComponentProps<typeof FlatList<T>>, 'refreshControl' | 'onRefresh' | 'data' | 'renderItem'>) => {
  const theme = useTheme();
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const isRefreshing = externalRefreshing !== undefined ? externalRefreshing : internalRefreshing;

  const handleRefresh = async () => {
    if (externalOnRefresh) {
      externalOnRefresh();
      return;
    }

    setInternalRefreshing(true);
    try {
      await refreshConfig.onRefresh();
      
      if (refreshConfig.showToast !== false) {
        console.log(refreshConfig.successMessage || 'Data refreshed successfully');
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      
      if (refreshConfig.showToast !== false) {
        const errorMessage = error instanceof Error ? error.message : (refreshConfig.errorMessage || 'Refresh failed');
        console.error(errorMessage);
      }
    } finally {
      setInternalRefreshing(false);
    }
  };

  return (
    <PullToRefreshWrapper
      refreshConfig={refreshConfig}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      showRefreshIndicator={showRefreshIndicator}
      refreshIndicatorText={refreshIndicatorText}
    >
      <FlatList<T>
        {...flatListProps}
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false} // Disable vertical scroll indicator
      />
    </PullToRefreshWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  refreshText: {
    marginLeft: 10,
    fontSize: 14,
  },
});

export default PullToRefreshWrapper;
