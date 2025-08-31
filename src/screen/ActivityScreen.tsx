import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Alert, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components directly to avoid index file issues
import { ActivityHeader } from '../components/ActivityScreen/ActivityHeader';
import { ActivityCardList } from '../components/ActivityScreen/ActivityCardList';
import { ActionButtons } from '../components/ActivityScreen/ActionButtons';
import { ProgressOverview } from '../components/ActivityScreen/ProgressOverview';

// Import custom hooks
import { 
  useSafeValues, 
  useAutoScroll, 
  useRetryHandler 
} from '../hooks';

// Import other hooks and types
import { useAuth } from '../context/AuthContext';
import { useActivityConsolidation } from '../hooks/useActivityConsolidation';
import { useActivityManager } from '../hooks/useActivityManager';
import { useActivityScreenState } from '../hooks/useActivityScreenState';
import { useActivityStatistics, useTotalRecordsCount } from '../hooks/useActivityStatistics';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { ConsolidatedApiRecord } from '../hooks/useActivityConsolidation';
import { createActivityScreenStyles } from '../styles/ActivityScreen.styles';

type ActivityScreenRouteProp = RouteProp<RootStackParamList, 'Activity'>;

/**
 * ActivityScreen - Main screen for displaying sync activity
 * 
 * This component has been refactored to:
 * - Use custom hooks for better separation of concerns
 * - Remove redundant useMemo calls
 * - Consolidate duplicate logic
 * - Make the code more maintainable for junior developers
 */
const ActivityScreen: React.FC = () => {
  const route = useRoute<ActivityScreenRouteProp>();
  const { logout, defaultOrgId } = useAuth();
  const navigation = useNavigation<any>();
  const styles = createActivityScreenStyles();
  
  // Track if the initial process has been started
  const hasInitialProcessStarted = useRef(false);

  // Custom hooks for state management and data processing
  const {
    addApiAttempt,
    removeApiAttempt,
    toggleCardExpansion,
    isApiAttempting,
    isCardExpanded,
  } = useActivityScreenState();

  const {
    activities,
    isProcessing,
    overallProgress,
    startActivityProcess,
    retryFailedApis,
  } = useActivityManager();

  // Device size detection for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallDevice = screenWidth <= 375;
  const isTablet = screenWidth > 768;

  // Use custom hooks for data processing
  const consolidatedApiRecords = useActivityConsolidation(activities || []);
  const statistics = useActivityStatistics(consolidatedApiRecords);
  const totalRecordsCount = useTotalRecordsCount(consolidatedApiRecords);

  // Use custom hook for safe values (replaces multiple useMemo calls)
  const safeValues = useSafeValues(
    { 
      selectedOrgId: route.params.selectedOrgId, 
      responsibilities: route.params.responsibilities, 
      defaultOrgId: defaultOrgId
    },
    { 
      overallProgress, 
      statistics, 
      totalRecordsCount, 
      consolidatedApiRecords 
    }
  );

  // Use custom hook for auto-scrolling (replaces duplicate useEffect logic)
  const { scrollViewRef, cardRefs, handleAutoScroll } = useAutoScroll();

  // Use custom hook for retry handling (replaces duplicate retry logic)
  const { handleRetryAllFailed, handleIndividualRetry: handleIndividualRetryFromHook } = useRetryHandler(
    addApiAttempt,
    removeApiAttempt,
    retryFailedApis
  );

  // Start the activity process only once when component mounts
  useEffect(() => {
    if (safeValues.selectedOrgId && 
        safeValues.responsibilities.length && 
        !hasInitialProcessStarted.current) {
      hasInitialProcessStarted.current = true;
      startActivityProcess(
        safeValues.selectedOrgId, 
        safeValues.responsibilities, 
        safeValues.defaultOrgId
      );
    }
  }, [safeValues.selectedOrgId, safeValues.responsibilities, safeValues.defaultOrgId, startActivityProcess]);

  // Auto-scroll to relevant cards (consolidated logic)
  useEffect(() => {
    handleAutoScroll(safeValues.consolidatedApiRecords, isProcessing);
  }, [safeValues.consolidatedApiRecords, isProcessing, handleAutoScroll]);

  /**
   * Handle logout with confirmation dialog
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will cancel any ongoing synchronization.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            if (logout) {
              logout();
            }
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          }
        }
      ]
    );
  };

  /**
   * Handle retry for all failed APIs
   */
  const handleRetryFailed = async () => {
    const failedRecords = safeValues.consolidatedApiRecords.filter(record => 
      record.status === 'error' || record.status === 'failure'
    );
    await handleRetryAllFailed(failedRecords);
  };

  /**
   * Handle retry for individual API record
   */
  const handleIndividualRetry = async (record: ConsolidatedApiRecord) => {
    await handleIndividualRetryFromHook(record, isApiAttempting);
  };

  // Memoized computed values for performance
  const hasErrors = safeValues.consolidatedApiRecords.some(record => record.status === 'error');
  const hasFailures = safeValues.consolidatedApiRecords.some(record => record.status === 'failure');
  const showRetryButton = hasErrors || hasFailures;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title and logout button */}
      <ActivityHeader onLogout={handleLogout} />

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          isSmallDevice && styles.smallDeviceContent,
          isTablet && styles.tabletContent
        ]}
      >
        {/* Progress Overview Card */}
        <ProgressOverview 
          overallProgress={safeValues.overallProgress}
          statistics={safeValues.statistics}
          totalRecordsCount={safeValues.totalRecordsCount}
        />

        {/* Activity Card List */}
        <ActivityCardList
          records={safeValues.consolidatedApiRecords}
          cardRefs={cardRefs}
          isExpanded={isCardExpanded}
          onToggleExpansion={toggleCardExpansion}
          onRetry={handleIndividualRetry}
          isRetrying={isApiAttempting}
        />

        {/* Action Buttons */}
        <ActionButtons
          showRetryButton={showRetryButton}
          failedCount={safeValues.statistics.failed}
          onRetryFailed={handleRetryFailed}
          isProcessing={isProcessing}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityScreen;