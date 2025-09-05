import React, { useMemo } from 'react';
import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import { PullToRefreshFlatList } from '../components/PullToRefreshWrapper';
import { BUSINESS_CONFIG } from '../config';
import { TableNames } from '../constants/tables';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDynamicTables, useOrganizations, useOrganizationSelection } from '../hooks';
import { getInventoryOrganizationsApi, getInventoryOrganizationsMetadataApi } from '../services/api';
import { createOrganizationScreenStyles } from '../styles/OrganizationScreen.styles';

import { OrganizationEmptyState, OrganizationItem, OrganizationListFooter, SearchBar } from '../components';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';

const OrganizationScreen: React.FC = () => {
  const { defaultOrgId } = useAuth();
  const theme = useTheme();
  const { createTableFromApiResponse } = useDynamicTables();
  const { showError, showSuccess } = useAttractiveNotification();
  
  // Device size detection for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallDevice = screenWidth <= 375;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;

  // API refresh function for pull-to-refresh
  const refreshOrganizationsFromAPI = async () => {
    try {
      const [orgMetadata, orgDataResponse] = await Promise.all([
        getInventoryOrganizationsMetadataApi(),
        getInventoryOrganizationsApi(defaultOrgId || '')
      ]);

      const dataArray = orgDataResponse?.ActiveInventories || orgDataResponse?.Response || [];
      
      if (dataArray.length) {
        const result = await createTableFromApiResponse(
          TableNames.ORGANIZATIONS,
          orgMetadata,
          dataArray
        );
        
        if (!result.success) {
          showError('Error', result.error || 'Failed to update local database');
          throw new Error(result.error || 'Failed to update local database');
        }
        showSuccess('Success', 'Organizations refreshed successfully');
      } else {
        showError('Error', 'No organization data received from API');
        throw new Error('No organization data received from API');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh organizations';
      showError('Error', errorMessage);
      throw error; // Re-throw to let the hook handle it
    }
  };

  // Custom hooks for organization management
  const {
    organizations,
    loading,
    searchText,
    handleSearch,
    loadMore,
    refresh,
  } = useOrganizations({
    pageSize: BUSINESS_CONFIG.PAGINATION.ORGANIZATION_PAGE_SIZE,
    searchDebounceMs: BUSINESS_CONFIG.PAGINATION.ORGANIZATION_SEARCH_DEBOUNCE_MS,
  });

  const {
    selectedId,
    isProcessing,
    handleSelectOrganization,
    handleConfirmSelection,
  } = useOrganizationSelection();

  // Memoized values for performance
  const styles = useMemo(() => createOrganizationScreenStyles(theme), [theme]);
  
  const searchResultsCount = useMemo(() => {
    if (!searchText || !organizations.length) return null;
    return `${organizations.length} organization${organizations.length !== 1 ? 's' : ''} found`;
  }, [searchText, organizations.length]);

  const isInitialLoad = useMemo(() => loading && organizations.length === 0, [loading, organizations.length]);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    await refresh(refreshOrganizationsFromAPI);
  };

  // Handle infinite scrolling
  const handleEndReached = () => {
    loadMore();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Select Organization" />

      <View style={[
        styles.content,
        isSmallDevice && styles.smallDeviceContent,
        isTablet && styles.tabletContent,
        isDesktop && styles.desktopContent
      ]}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Search organizations..."
          />
          {searchResultsCount && (
            <Text style={styles.searchResultsCount}>
              {searchResultsCount}
            </Text>
          )}
        </View>

        <PullToRefreshFlatList
          data={organizations}
          keyExtractor={(item) => String(item.InventoryOrgId ?? item.id)}
          renderItem={({ item }) => (
            <OrganizationItem
              item={item}
              selected={selectedId === String(item.InventoryOrgId ?? item.id)}
              onSelect={handleSelectOrganization}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.ON_END_REACHED_THRESHOLD}
          initialNumToRender={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.INITIAL_NUM_TO_RENDER}
          maxToRenderPerBatch={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.MAX_TO_RENDER_PER_BATCH}
          windowSize={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.WINDOW_SIZE}
          removeClippedSubviews
          ListFooterComponent={<OrganizationListFooter loading={loading} />}
          ListEmptyComponent={
            <OrganizationEmptyState
              searchText={searchText}
              loading={loading}
              refreshing={false}
              isInitialLoad={isInitialLoad}
            />
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

      <SafeAreaView style={[
        styles.stickyFooter,
        isSmallDevice && styles.smallDeviceFooter,
        isTablet && styles.tabletFooter,
        isDesktop && styles.desktopFooter
      ]}>
        <Button
          title="Confirm Organization"
          onPress={handleConfirmSelection}
          disabled={!selectedId || isProcessing}
          fullWidth
          accessibilityLabel={selectedId ? "Confirm organization selection" : "Select an organization first"}
          size="lg"
          variant="solid"
          colorScheme="primary"
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        />
      </SafeAreaView>
    </View>
  );
};

export default OrganizationScreen;


