import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { ShippingTableService } from '../services/shippingTableService';
import { loadToDockService } from '../services/loadToDockService';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface UseOrganizationSelectionConfig {
  createTableFromTableTypeResponse: any;
  createTableFromApiResponse: any;
}

export const useOrganizationSelection = (config: UseOrganizationSelectionConfig) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Organization'>>();
  const { showError, showSuccess } = useAttractiveNotification();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { createTableFromTableTypeResponse, createTableFromApiResponse } = config;

  // Handle organization selection
  const handleSelectOrganization = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // Handle organization confirmation and navigation
  const handleConfirmSelection = useCallback(async () => {
    if (!selectedId) return;

    try {
      setIsProcessing(true);
      
      // Call shipping table service to fetch and create table
      const result = await ShippingTableService.fetchAndCreateShippingTable(
        selectedId,
        createTableFromTableTypeResponse,
        createTableFromApiResponse
      );

      // Create media storage table
      await loadToDockService.createMediaStorageTable();

      if (result.success) {
        showSuccess('Success', 'Shipping table data loaded successfully');
        navigation.navigate('Dashboard');
      } else {
        showError('Error', result.error || 'Failed to load shipping table data');
      }
    } catch (error) {
      console.error('Failed to load shipping table data:', error);
      showError('Error', 'Failed to load shipping table data');
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedId, 
    navigation, 
    showError, 
    showSuccess, 
    createTableFromTableTypeResponse, 
    createTableFromApiResponse
  ]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
    isProcessing,
    handleSelectOrganization,
    handleConfirmSelection,
    clearSelection,
  };
};
