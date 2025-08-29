import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createOrganizationScreenStyles } from '../styles/OrganizationScreen.styles';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { fetchOrganizationsPaged } from '../services/organizationService';
import { getInventoryOrganizationsApi, getInventoryOrganizationsMetadataApi } from '../services/api';
import { useDynamicTables } from '../hooks';
import { TableNames } from '../constants/tables';
import type { OrganizationListItem } from '../types/organization.interface';
import { PullToRefreshFlatList } from '../components/PullToRefreshWrapper';
import { useOrganizationRefresh } from '../hooks';
import { ShippingTableService } from '../services/shippingTableService';
import { useToast } from '../utils/toastUtils';

import AppHeader from '../components/AppHeader';
import { SearchBar } from '../components';
import { Button } from '../components/Button';
import { loadToDockService } from '../services/loadToDockService';

const FlatListSeparator: React.FC = () => {
  const theme = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.colors.separator }} />;
};

const ListFooter: React.FC<{ loading: boolean }> = ({ loading }) => {
  const theme = useTheme();
  return (
    <View style={{ paddingVertical: 16, alignItems: 'center', justifyContent: 'center' }}>
      {loading ? <ActivityIndicator size="small" color={theme.colors.textSecondary} /> : null}
    </View>
  );
};

const OrganizationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Organization'>>();
  const { createTableFromApiResponse, createTableFromTableTypeResponse } = useDynamicTables();
  const { defaultOrgId } = useAuth();
  const theme = useTheme();
  const { refreshData, refreshing } = useOrganizationRefresh();
  const { showErrorToast } = useToast();

  // State management
  const [searchText, setSearchText] = useState('');
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const limit = 30;
  const mountedRef = useRef(true);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigation setup
  useEffect(() => {
    mountedRef.current = true;
    navigation.setOptions({ headerShown: false });
    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [navigation]);

  // API refresh function
  const refreshOrganizationsFromAPI = useCallback(async () => {
    if (!defaultOrgId) {
      throw new Error('Default organization ID not available. Please login again.');
    }
    
    const [orgMetadata, orgDataResponse] = await Promise.all([
      getInventoryOrganizationsMetadataApi(),
      getInventoryOrganizationsApi(defaultOrgId)
    ]);

    const dataArray = orgDataResponse?.ActiveInventories || orgDataResponse?.Response || [];
    
    if (dataArray.length) {
      const result = await createTableFromApiResponse(
        TableNames.ORGANIZATIONS,
        orgMetadata,
        dataArray
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update local database');
      }
    } else {
      throw new Error('No organization data received from API');
    }
  }, [defaultOrgId, createTableFromApiResponse]);

  // Load organizations from database
  const loadOrganizations = useCallback(async (searchQuery: string = '', pageNum: number = 0, append: boolean = false) => {
    if (loading && !append) return; // Prevent multiple simultaneous loads
    
    try {
      setLoading(true);
      
      const { rows } = await fetchOrganizationsPaged({ 
        page: pageNum, 
        limit, 
        search: searchQuery.trim()
      });
      
      if (!mountedRef.current) return;
      
      if (append) {
        setOrganizations(prev => [...prev, ...rows]);
      } else {
        setOrganizations(rows);
      }
      
      setPage(pageNum);
      setHasMore(rows.length === limit);
      
    } catch (error) {
      console.warn('Failed to load organizations:', error);
      if (!mountedRef.current) return;
      
      // Show empty state on error
      setOrganizations([]);
      setHasMore(false);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  }, [loading, limit]);

  // Store loadOrganizations in ref to avoid dependency issues
  const loadOrganizationsRef = useRef(loadOrganizations);
  loadOrganizationsRef.current = loadOrganizations;

  // Initial load
  useEffect(() => {
    loadOrganizationsRef.current();
  }, []); // Only run once on mount

  // Handle search changes with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setPage(0);
        setHasMore(true);
        loadOrganizationsRef.current(searchText, 0, false);
      }
    }, 500); // Increased debounce time to reduce API calls
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText]); // Remove loadOrganizations dependency to prevent infinite loops

  // Load more data when scrolling
  const onEndReached = useCallback(() => {
    if (loading || !hasMore || searchText.trim()) return; // Don't paginate during search
    loadOrganizationsRef.current(searchText, page + 1, true);
  }, [loading, hasMore, searchText, page]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    try {
      await refreshData(refreshOrganizationsFromAPI);
      // Reset state and reload
      setPage(0);
      setHasMore(true);
      setSelectedId(null);
      await loadOrganizationsRef.current(searchText, 0, false);
    } catch (error) {
      console.warn('Refresh failed:', error);
    }
  }, [refreshData, refreshOrganizationsFromAPI, searchText]);

  // Navigation
  const onConfirm = useCallback(async () => {
    if (!selectedId) return;

    try {
      setLoading(true);
      
      // Call shipping table service to fetch and create table
      const result = await ShippingTableService.fetchAndCreateShippingTable(
        selectedId,
        createTableFromTableTypeResponse,
        createTableFromApiResponse
      );

      await loadToDockService.createMediaStorageTable();

      if (result.success) {
        // showSuccessToast('Success', 'Shipping table data loaded successfully');
        navigation.navigate('Dashboard');
      } else {
        showErrorToast('Error', result.error || 'Failed to load shipping table data');
      }
    } catch (error) {
      console.error('Failed to load shipping table data:', error);
      showErrorToast('Error', 'Failed to load shipping table data');
    } finally {
      setLoading(false);
    }
  }, [selectedId, navigation, showErrorToast, createTableFromTableTypeResponse, createTableFromApiResponse]);

  // Render organization item
  const renderItem = ({ item }: { item: OrganizationListItem }) => {
    const id = String(item.InventoryOrgId ?? item.id ?? '');
    const name = item.InventoryOrgName || '';
    const code = item.InventoryOrgCode || id;
    const selected = selectedId === id;
    
    return (
      <TouchableOpacity 
        style={styles.item} 
        onPress={() => setSelectedId(id)} 
        accessibilityRole="radio" 
        accessibilityState={{ selected }}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemHeaderLeft}>
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
              {selected ? <View style={styles.radioInner} /> : null}
            </View>
            <Text style={[styles.itemName, selected && styles.selected]} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View style={[styles.codePill, selected && styles.codePillSelected]}>
            <Text style={[styles.codePillText, selected && styles.codePillTextSelected]} numberOfLines={1}>
              {code}
            </Text>
          </View>
        </View>
        {!!id && <Text style={styles.itemSubtitle} numberOfLines={1}>{id}</Text>}
      </TouchableOpacity>
    );
  };

  const styles = createOrganizationScreenStyles(theme);
  
  return (
    <View style={styles.container}>
      <AppHeader title="Select Organization" />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search organizations..."
          />
        </View>

        <PullToRefreshFlatList
          data={organizations}
          keyExtractor={(item) => String(item.InventoryOrgId ?? item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={FlatListSeparator}
          contentContainerStyle={styles.listContent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          initialNumToRender={20}
          maxToRenderPerBatch={30}
          windowSize={11}
          removeClippedSubviews
          ListFooterComponent={<ListFooter loading={loading} />}
          ListEmptyComponent={
            !loading && !refreshing && !isInitialLoad ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchText ? 'No organizations found' : 'No organizations available'}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchText ? 'Try adjusting your search terms' : 'Pull down to refresh'}
                </Text>
              </View>
            ) : null
          }
          refreshConfig={{
            onRefresh: handleRefresh,
            successMessage: 'Organizations refreshed successfully',
            errorMessage: 'Failed to refresh organizations',
          }}
          showRefreshIndicator={true}
          refreshIndicatorText="Refreshing organizations..."
        />
      </View>

      <View style={styles.stickyFooter}>
        <Button
          title="Confirm"
          onPress={onConfirm}
          disabled={!selectedId || loading}
          fullWidth
          accessibilityLabel="Confirm organization selection"
          size="lg"
        />
      </View>
    </View>
  );
};



export default OrganizationScreen;


