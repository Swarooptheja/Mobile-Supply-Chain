import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useUserResponsibilities } from './useUserResponsibilities';
import { useOrganization } from '../context/OrganizationContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CONFIG_RESPOSIBILITIES, MASTER_RESPOSIBILITIES } from '../config/api';


export const useOrganizationSelection = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Organization'>>();
  const { showError } = useAttractiveNotification();
  const { selectedOrgId, setSelectedOrgId } = useOrganization();
  const [isProcessing, setIsProcessing] = useState(false);
  const { responsibilities, error: responsibilitiesError } = useUserResponsibilities();

  // Handle organization selection
  const handleSelectOrganization = useCallback((id: string) => {
    setSelectedOrgId(id);
  }, [setSelectedOrgId]);

  // Handle organization confirmation and navigation
  const handleConfirmSelection = useCallback(async () => {
    if (!selectedOrgId) return;

    try {
      setIsProcessing(true);
      
      // Navigate to Activity Screen for comprehensive API synchronization
      if (responsibilities.length) {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Activity',
            params: {
              selectedOrgId: selectedOrgId,
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
  }, [selectedOrgId, navigation, showError, responsibilities, responsibilitiesError]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedOrgId(null);
  }, [setSelectedOrgId]);

  return {
    selectedId: selectedOrgId,
    isProcessing,
    handleSelectOrganization,
    handleConfirmSelection,
    clearSelection,
  };
};
