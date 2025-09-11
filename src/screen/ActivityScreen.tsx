import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Alert, Dimensions, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components directly to avoid index file issues
import { ActivityHeader } from '../components/ActivityScreen/ActivityHeader';
import { ActivityCardList } from '../components/ActivityScreen/ActivityCardList';
import { ActionButtons } from '../components/ActivityScreen/ActionButtons';
import { ProgressOverview } from '../components/ActivityScreen/ProgressOverview';
import AuthGuard from '../components/AuthGuard';

// Import custom hooks
import { 
  useSafeValues, 
  useRetryHandler,
  useActivityData
} from '../hooks';

// Import other hooks and types
import { useAuth } from '../context/AuthContext';
import { useActivityManager } from '../hooks/useActivityManager';
import { useActivityScreenState } from '../hooks/useActivityScreenState';
import { useTranslation } from '../hooks/useTranslation';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { ConsolidatedApiRecord } from '../hooks/useActivityConsolidation';
import { createActivityScreenStyles } from '../styles/ActivityScreen.styles';
import { useTheme } from '../context/ThemeContext';

type ActivityScreenRouteProp = RouteProp<RootStackParamList, 'Activity'>;

/**
 * ActivityScreen - Main screen for displaying sync activity
 * 
 * This component has been refactored to:
 * - Use custom hooks for better separation of concerns
 * - Remove redundant useMemo calls
 * - Consolidate duplicate logic
 * - Make the code more maintainable for junior developers
 * - Automatically navigate to Dashboard when all APIs succeed
 * 
 * ## Automatic Navigation Feature
 * 
 * When all Master and Config APIs are successfully completed:
 * 1. A success notification is displayed
 * 2. After 2.5 seconds, the user is automatically redirected to the Dashboard
 * 
 * The navigation happens automatically without requiring user interaction.
 */
const ActivityScreen: React.FC = () => {
  const route = useRoute<ActivityScreenRouteProp>();
  const { logout, defaultOrgId } = useAuth();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createActivityScreenStyles(theme);
  
  // Track if the initial process has been started
  const hasInitialProcessStarted = useRef(false);
  // Track if navigation to dashboard has been triggered
  const hasNavigatedToDashboard = useRef(false);

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
    canProceedToDashboard,
    startActivityProcess,
    retryFailedApis,
  } = useActivityManager();

  // Device size detection for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallDevice = screenWidth <= 375;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  const isLandscape = screenWidth > screenHeight;

  // Use consolidated hook for all activity data (replaces multiple separate hooks)
  const activityData = useActivityData(activities || []);

  // Use custom hook for safe values (replaces multiple useMemo calls)
  const safeValues = useSafeValues(
    { 
      selectedOrgId: route.params.selectedOrgId, 
      responsibilities: route.params.responsibilities, 
      defaultOrgId: defaultOrgId
    },
    { 
      overallProgress, 
      consolidatedApiRecords: activityData.consolidated 
    }
  );

  // Simple refs for scroll view and cards
  const scrollViewRef = useRef<ScrollView>(null);
  const cardRefs = useRef<{ [key: string]: View | null }>({});

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


  // Automatically navigate to Dashboard when ALL APIs (master, config, and transactional) are successful
  useEffect(() => {
    if (canProceedToDashboard && 
        !isProcessing && 
        !hasNavigatedToDashboard.current &&
        activities.length > 0) {
      
      hasNavigatedToDashboard.current = true;
    
      
      // Navigate to Dashboard after showing success message
      // This gives users time to see the completion state and read the notification
      // setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' as never }],
        });
      // }, 2500); // Wait for notification to be visible
    }
  }, [canProceedToDashboard, isProcessing, activities.length, navigation]);

  /**
   * Handle logout with confirmation dialog
   */
  const handleLogout = () => {
    Alert.alert(
      t('activity.logout'),
      t('activity.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('activity.logout'), 
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

  // Use pre-computed values from the consolidated hook (no need to recalculate)
  const showRetryButton = activityData.hasErrors || activityData.hasFailures;

  return (
    <AuthGuard allowBack={false}>
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
          isTablet && styles.tabletContent,
          isDesktop && styles.desktopContent,
          isLandscape && styles.landscapeContent
        ]}
      >
        {/* Progress Overview Card */}
        <ProgressOverview 
          overallProgress={safeValues.overallProgress}
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
          failedCount={activityData.failedCount}
          onRetryFailed={handleRetryFailed}
          isProcessing={isProcessing}
        />
      </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
};

export default ActivityScreen;