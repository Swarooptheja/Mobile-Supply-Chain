import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { createProgressOverviewStyles } from '../../styles/ActivityScreen.styles';
import { useTranslation } from '../../hooks/useTranslation';

interface ProgressOverviewProps {
  overallProgress: { percentage: number };
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  overallProgress
}) => {
  const { t } = useTranslation();
  const styles = createProgressOverviewStyles();
  
  // Safe values with fallbacks to prevent null rendering errors
  const safeOverallProgress = overallProgress?.percentage ?? 0;
  
  // Ensure percentage is within valid bounds
  const safePercentage = Math.max(0, Math.min(100, safeOverallProgress));
  
  return (
    <View style={styles.progressOverview}>
      {/* Header with icon and title */}
      <View style={styles.progressHeader}>
        <View style={styles.progressIconContainer}>
          <VectorIcon
            name="sync"
            iconSet="MaterialIcons"
            size={20}
            color="#3B82F6"
          />
        </View>
        <Text style={styles.progressTitle}>{t('activity.dataSyncStatus')}</Text>
      </View>
      
      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeaderRow}>
          <Text style={styles.progressLabel}>{t('activity.progress')}</Text>
          <Text style={styles.progressPercentage}>
            {safePercentage}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${safePercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};
