import React, { useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ListRenderItemInfo
} from 'react-native';

interface InfiniteScrollListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  onLoadMore: () => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  keyExtractor: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: any;
  style?: any;
  showsVerticalScrollIndicator?: boolean;
  onEndReachedThreshold?: number;
}

const InfiniteScrollList = <T extends any>({
  data,
  renderItem,
  onLoadMore,
  onRefresh,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = true,
  onEndReachedThreshold = 0.1
}: InfiniteScrollListProps<T>) => {
  const isEndReachedRef = useRef(false);
  
  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading && !isEndReachedRef.current) {
      isEndReachedRef.current = true;
      onLoadMore().finally(() => {
        isEndReachedRef.current = false;
      });
    }
  }, [hasMore, isLoadingMore, isLoading, onLoadMore]);

  const handleRefresh = useCallback(async () => {
    await onRefresh();
  }, [onRefresh]);

  const renderFooter = useMemo(() => {
    if (!hasMore) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>No more items to load</Text>
        </View>
      );
    }

    if (isLoadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color="#1e3a8a" />
          <Text style={styles.footerText}>Loading more...</Text>
        </View>
      );
    }

    return null;
  }, [hasMore, isLoadingMore]);

  const renderError = useMemo(() => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Text style={styles.errorSubtext}>Pull down to refresh</Text>
      </View>
    );
  }, [error]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={handleRefresh}
      colors={['#1e3a8a']}
      tintColor="#1e3a8a"
    />
  ), [isLoading, handleRefresh]);

  if (isLoading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }: ListRenderItemInfo<T>) => renderItem(item, index)}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={renderFooter}
      refreshControl={refreshControl}
      contentContainerStyle={[
        styles.contentContainer,
        contentContainerStyle
      ]}
      style={[styles.container, style]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={undefined}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 12,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default InfiniteScrollList;
