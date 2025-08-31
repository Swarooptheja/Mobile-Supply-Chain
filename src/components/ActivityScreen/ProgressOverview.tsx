import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { StatItem } from './StatItem';
import { createProgressOverviewStyles } from '../../styles/ActivityScreen.styles';

interface ProgressOverviewProps {
  overallProgress: { percentage: number };
  statistics: { completed: number; failed: number; total: number; processing: number };
  totalRecordsCount: number;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  overallProgress,
  statistics,
  totalRecordsCount
}) => {
  const styles = createProgressOverviewStyles();
  
  // Safe values with fallbacks to prevent null rendering errors
  const safeOverallProgress = overallProgress?.percentage ?? 0;
  const safeStatistics = {
    completed: statistics?.completed ?? 0,
    failed: statistics?.failed ?? 0,
    total: statistics?.total ?? 0,
    processing: statistics?.processing ?? 0
  };
  const safeTotalRecordsCount = totalRecordsCount ?? 0;
  
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
        <Text style={styles.progressTitle}>Data Sync Status</Text>
      </View>
      
      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeaderRow}>
          <Text style={styles.progressLabel}>Progress</Text>
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
      
      <View style={styles.progressStats}>
        <StatItem
          icon={{ name: "check-circle", iconSet: "MaterialIcons", color: "#10B981" }}
          value={safeStatistics.completed}
          label="COMPLETED"
          containerStyle={styles.statItemCompleted}
          numberStyle={styles.statNumberCompleted}
          labelStyle={styles.statLabelCompleted}
        />
        <StatItem
          icon={{ name: "error", iconSet: "MaterialIcons", color: "#EF4444" }}
          value={safeStatistics.failed}
          label="FAILED"
          containerStyle={styles.statItemFailed}
          numberStyle={styles.statNumberFailed}
          labelStyle={styles.statLabelFailed}
        />
        <StatItem
          icon={{ name: "storage", iconSet: "MaterialIcons", color: "#64748B" }}
          value={safeStatistics.total}
          label="TOTAL APIS"
          containerStyle={styles.statItemTotal}
          numberStyle={styles.statNumberTotal}
          labelStyle={styles.statLabelTotal}
        />
        <StatItem
          icon={{ name: "trending-up", iconSet: "MaterialIcons", color: "#3B82F6" }}
          value={safeTotalRecordsCount}
          label="RECORDS"
          containerStyle={styles.statItemRecords}
          numberStyle={styles.statNumberRecords}
          labelStyle={styles.statLabelRecords}
        />
      </View>
    </View>
  );
};
