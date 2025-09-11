import React, { useMemo } from 'react';
import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import { PullToRefreshFlatList } from '../components/PullToRefreshWrapper';
import { BUSINESS_CONFIG } from '../config';
import { TableNames } from '../constants/tables';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { useDynamicTables, useOrganizations, useOrganizationSelection } from '../hooks';
import { getInventoryOrganizationsApi, getInventoryOrganizationsMetadataApi } from '../services/api';
import { createOrganizationScreenStyles } from '../styles/OrganizationScreen.styles';

import { OrganizationEmptyState, OrganizationItem, OrganizationListFooter, SearchBar } from '../components';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import AuthGuard from '../components/AuthGuard';

const OrganizationScreen: React.FC = () => {
  const { defaultOrgId } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
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
          showError(t('common.error'), result.error || t('organization.refreshFailed'));
          throw new Error(result.error || t('organization.refreshFailed'));
        }
        showSuccess(t('common.success'), t('organization.organizationsRefreshed'));
      } else {
        showError(t('common.error'), t('organization.refreshFailed'));
        throw new Error(t('organization.refreshFailed'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('organization.refreshFailed');
      showError(t('common.error'), errorMessage);
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
    if (!searchText || !organizations || !organizations.length) return null;
    const count = organizations.length;
    const plural = count !== 1 ? 's' : '';
    return t('organization.organizationsFound', { count, plural });
  }, [searchText, organizations, t]);

  const isInitialLoad = useMemo(() => loading && (!organizations || organizations.length === 0), [loading, organizations]);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    await refresh(refreshOrganizationsFromAPI);
  };

  // Handle infinite scrolling
  const handleEndReached = () => {
    loadMore();
  };

  return (
    <AuthGuard allowBack={false}>
      <View style={styles.container}>
        <AppHeader title={t('organization.title')} />

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
            placeholder={t('organization.searchPlaceholder')}
          />
          {searchResultsCount && (
            <Text style={styles.searchResultsCount}>
              {searchResultsCount}
            </Text>
          )}
        </View>

        <PullToRefreshFlatList
          data={organizations || []}
          keyExtractor={(item) => String(item?.InventoryOrgId ?? item?.id ?? '')}
          renderItem={({ item }) => {
            if (!item) return null;
            return (
              <OrganizationItem
                item={item}
                selected={selectedId === String(item?.InventoryOrgId ?? item?.id ?? '')}
                onSelect={handleSelectOrganization}
              />
            );
          }}
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
            successMessage: t('organization.organizationsRefreshed'),
            errorMessage: t('organization.refreshFailed'),
          }}
          showRefreshIndicator={true}
          refreshIndicatorText={t('organization.refreshingOrganizations')}
        />
      </View>

      <SafeAreaView style={[
        styles.stickyFooter,
        isSmallDevice && styles.smallDeviceFooter,
        isTablet && styles.tabletFooter,
        isDesktop && styles.desktopFooter
      ]}>
        <Button
          title={t('organization.confirmOrganization')}
          onPress={handleConfirmSelection}
          disabled={!selectedId || isProcessing}
          fullWidth
          accessibilityLabel={selectedId ? t('organization.confirmOrganizationSelection') : t('organization.selectOrganizationFirst')}
          size="lg"
          variant="solid"
          colorScheme="primary"
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        />
      </SafeAreaView>
      </View>
    </AuthGuard>
  );
};

export default OrganizationScreen;


