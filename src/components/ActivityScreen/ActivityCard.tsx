import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { ConsolidatedApiRecord } from '../../hooks/useActivityConsolidation';
import { createActivityCardStyles } from '../../styles/ActivityScreen.styles';
import { getCurrentApiConfig } from '../../config/api';
import { 
  getStatusColor, 
  getStatusIcon, 
  getTypeColor, 
  getTypeIcon
} from '../../utils/activityHelper';

interface ActivityCardProps {
  record: ConsolidatedApiRecord;
  isExpanded: boolean;
  onToggleExpansion: (cardId: string) => void;
  onRetry: (record: ConsolidatedApiRecord) => void;
  isRetrying: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  record,
  isExpanded,
  onToggleExpansion,
  onRetry,
  isRetrying
}) => {
  const styles = createActivityCardStyles();
  
  const handleRetry = () => {
    onRetry(record);
  };

  const handleToggleExpansion = () => {
    if (record.canExpand) {
      onToggleExpansion(record.id);
    }
  };

  // Function to build the full API URL
  const getFullApiUrl = (): string => {
    const config = getCurrentApiConfig();
    const relativePath = record.activities?.[0]?.url || '';
    const orgId = record.activities?.[0]?.orgId;
    
    if (!relativePath) {
      return 'API endpoint not configured';
    }
    
    // If the URL already starts with http/https, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    
    // Check if the relative path already includes the project and version
    let fullPath = relativePath;
    if (!relativePath.startsWith(`${config.project}/${config.version}/`)) {
      fullPath = `${config.project}/${config.version}/${relativePath}`;
    }
    
    // Add organization ID if available
    if (orgId && orgId !== 'pending') {
      fullPath = `${fullPath}/${orgId}`;
    }
    
    return `${config.hostname}/${fullPath}`;
  };

  // Safe text values with fallbacks
  const safeName = record.name || 'Unknown API';
  const safeType = record.type || 'unknown';
  const safeStatus = record.status || 'unknown';
  const safeError = record.error || 'Unknown error occurred';
  const safeInsertedRecords = record.insertedRecords || 0;
  const safeRetryCount = record.retryCount || 0;

  return (
    <View style={styles.syncCard}>
      {/* Left accent bar */}
      <View 
        style={[
          styles.accentBar, 
          { backgroundColor: getTypeColor(safeType) }
        ]} 
      />
      
      {/* Clickable card header - only when there are errors */}
      <TouchableOpacity
        style={styles.cardHeaderTouchable}
        onPress={handleToggleExpansion}
        activeOpacity={record.canExpand ? 0.7 : 1}
        accessible={true}
        accessibilityLabel={`${safeName} API card`}
        accessibilityHint={record.canExpand ? `Tap to ${isExpanded ? 'collapse' : 'expand'} this card` : 'This card shows successful sync status'}
        accessibilityRole={record.canExpand ? "button" : "none"}
      >
        {/* Card content */}
        <View style={styles.cardContent}>
          {/* Icon and title row */}
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <VectorIcon
                name={getTypeIcon(safeType).name}
                iconSet={getTypeIcon(safeType).iconSet}
                size={20}
                color={getTypeColor(safeType)}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>{safeName}</Text>
              <Text 
                style={[
                  styles.cardSubtitle, 
                  { color: getTypeColor(safeType) }
                ]}
              >
                {safeType.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Right side info */}
          <View style={styles.cardRightSide}>
            <Text style={styles.cardRecordCount}>{safeInsertedRecords}</Text>
            <Text style={styles.cardTimestamp}>
              {record.lastSyncTime ? 
                record.lastSyncTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                }) : 
                'Never'
              }
            </Text>
            <View style={styles.cardStatusRow}>
              <TouchableOpacity
                style={[
                  styles.statusIndicator, 
                  { backgroundColor: getStatusColor(safeStatus) }
                ]}
                accessible={true}
                accessibilityLabel={`${safeStatus} status for ${safeName}`}
                accessibilityHint={`API ${safeName} is in ${safeStatus} state`}
                accessibilityRole="button"
              >
                <VectorIcon
                  name={getStatusIcon(safeStatus).name}
                  iconSet={getStatusIcon(safeStatus).iconSet}
                  size={14}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              
              {/* Only show chevron for cards that can expand (have errors) */}
              {record.canExpand && (
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={handleToggleExpansion}
                  accessible={true}
                  accessibilityLabel={`${isExpanded ? 'Collapse' : 'Expand'} ${safeName} card`}
                  accessibilityHint={`Tap to ${isExpanded ? 'hide' : 'show'} more details`}
                  accessibilityRole="button"
                >
                  <VectorIcon
                    name={isExpanded ? "expand-less" : "expand-more"}
                    iconSet="MaterialIcons"
                    size={16}
                    color="#64748B"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        {/* Collapsed state summary - only show for expandable cards */}
        {record.canExpand && !isExpanded && (
          <View style={styles.collapsedSummary}>
            <Text style={styles.collapsedSummaryText}>
              Tap to expand • {safeStatus === 'success' ? `${safeInsertedRecords} records inserted` : safeStatus}
            </Text>
          </View>
        )}

        {/* Success message for non-expandable successful cards */}
        {!record.canExpand && safeStatus === 'success' && (
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>
              ✓ {safeInsertedRecords} records successfully inserted
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Expanded content - only show when card is expanded and has errors */}
      {isExpanded && record.canExpand && (
        <>
          {/* Main content area - Inserted Records */}
          {safeStatus === 'success' && safeInsertedRecords > 0 && (
            <View style={styles.insertedRecordsSection}>
              <Text style={styles.insertedRecordsNumber}>{safeInsertedRecords}</Text>
              <Text style={styles.insertedRecordsLabel}>Successfully Inserted</Text>
            </View>
          )}

          {/* Expanded error information */}
          {safeError && (
            <View style={styles.errorExpansion}>
              <View style={styles.errorHeader}>
                <VectorIcon
                  name="warning"
                  iconSet="MaterialIcons"
                  size={20}
                  color="#DC2626"
                  style={styles.errorIcon}
                />
                <Text style={styles.errorTitle}>API Endpoint:</Text>
              </View>
              
              {/* Show full API URL instead of just relative path */}
              <Text style={styles.errorMessage}>
                {getFullApiUrl()}
              </Text>
                

              {/* Error metadata */}
              <View style={styles.errorMetadata}>
                <View style={styles.errorMetaItem}>
                  <Text style={styles.errorMetaLabel}>Status:</Text>
                  <Text style={styles.errorMetaValue}>{safeStatus}</Text>
                </View>
                <View style={styles.errorMetaItem}>
                  <Text style={styles.errorMetaLabel}>Retry Count:</Text>
                  <Text style={styles.errorMetaValue}>{safeRetryCount}</Text>
                </View>
                {record.lastRetryTime && (
                  <View style={styles.errorMetaItem}>
                    <Text style={styles.errorMetaLabel}>Last Retry:</Text>
                    <Text style={styles.errorMetaValue}>
                      {record.lastRetryTime.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Retry button */}
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={handleRetry}
                disabled={isRetrying}
                accessible={true}
                accessibilityLabel={`Retry ${safeName} API`}
                accessibilityHint={`Tap to retry the failed ${safeName} API`}
                accessibilityRole="button"
              >
                <Text style={styles.retryButtonText}>
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};
