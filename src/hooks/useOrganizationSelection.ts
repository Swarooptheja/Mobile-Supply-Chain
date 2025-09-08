import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useUserResponsibilities } from './useUserResponsibilities';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CONFIG_RESPOSIBILITIES, MASTER_RESPOSIBILITIES } from '../config/api';


export const useOrganizationSelection = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Organization'>>();
  const { showError } = useAttractiveNotification();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { responsibilities, error: responsibilitiesError } = useUserResponsibilities();

  // Handle organization selection
  const handleSelectOrganization = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // Handle organization confirmation and navigation
  const handleConfirmSelection = useCallback(async () => {
    if (!selectedId) return;

    try {
      setIsProcessing(true);
      
      // Navigate to Activity Screen for comprehensive API synchronization
      if (responsibilities.length) {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Activity',
            params: {
              selectedOrgId: selectedId,
              responsibilities: [...responsibilities, ...MASTER_RESPOSIBILITIES, ...CONFIG_RESPOSIBILITIES],
            }
          }],
        });
      } else if (responsibilitiesError) {
        showError('Error', `Failed to get user responsibilities: ${responsibilitiesError}`);
      } else {
        showError('Error', 'No user responsibilities found');
      }
    } catch (error) {
      console.error('Failed to navigate to activity screen:', error);
      showError('Error', 'Failed to proceed to activity screen');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedId, navigation, showError, responsibilities, responsibilitiesError]);

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
