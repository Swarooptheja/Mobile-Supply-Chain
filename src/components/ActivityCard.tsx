import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { IActivity } from '../types/activity';
import { ActivityService } from '../services/activityService';
import { createActivityCardStyles } from '../styles/ActivityCard.styles';

interface ActivityCardProps {
  activity: IActivity;
  onRetry: () => void;
  isRetrying?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onRetry, isRetrying = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const styles = createActivityCardStyles(theme);

  const {
    name,
    type,
    status,
    progress,
    recordsTotal,
    recordsInserted,
    error,
    startTime,
    endTime,
    canExpand,
    retryCount,
    lastRetryTime,
  } = activity;

  const displayName = useMemo(() => ActivityService.getApiDisplayName(name), [name]);
  const description = useMemo(() => ActivityService.getApiDescription(name), [name]);

  const handleToggleExpand = () => {
    if (!canExpand) return;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'failure':
        return '⚠️';
      case 'processing':
        return '🔄';
      case 'blocked':
        return '🚫';
      case 'pending':
      default:
        return '⏳';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'master':
        return '🗄️';
      case 'config':
        return '⚙️';
      case 'transactional':
        return '⚡';
      default:
        return '📊';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return styles.successColor;
      case 'error':
        return styles.errorColor;
      case 'failure':
        return styles.failureColor;
      case 'processing':
        return styles.processingColor;
      case 'blocked':
        return styles.blockedColor;
      case 'pending':
      default:
        return styles.pendingColor;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Completed';
      case 'error':
        return 'Failed';
      case 'failure':
        return 'Failed (Max Retries)';
      case 'processing':
        return 'Processing...';
      case 'blocked':
        return 'Blocked';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const formatDuration = (start: Date | null, end: Date | null): string => {
    if (!start || !end) return 'N/A';
    
    const duration = end.getTime() - start.getTime();
    const seconds = Math.floor(duration / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatTimestamp = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString();
  };

  const canRetry = status === 'error' || status === 'failure';
  const showProgress = status === 'processing';
  const showRecords = status === 'success' && recordsTotal > 0;
  const showFailedRecords = status === 'success' && recordsTotal > 0 && recordsInserted < recordsTotal;

  return (
    <View style={[styles.container, getStatusColor()]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggleExpand}
        disabled={!canExpand}
        activeOpacity={canExpand ? 0.7 : 1}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
            <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{displayName}</Text>
            <Text style={styles.subtitle}>{description}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.typeBadge}>{type.toUpperCase()}</Text>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>
        
        {canExpand && (
          <Text style={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        )}
      </TouchableOpacity>

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progress}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}

      {/* Data Stats Section */}
      {showRecords && (
        <View style={styles.recordsContainer}>
          <View style={styles.recordsRow}>
            <Text style={styles.recordsLabel}>Total Records:</Text>
            <Text style={styles.recordsValue}>{recordsTotal}</Text>
          </View>
          <View style={styles.recordsRow}>
            <Text style={styles.recordsLabel}>Successfully Inserted:</Text>
            <Text style={styles.recordsValue}>{recordsInserted}</Text>
          </View>
          {showFailedRecords && (
            <View style={styles.recordsRow}>
              <Text style={styles.recordsLabel}>Failed Insertions:</Text>
              <Text style={[styles.recordsValue, styles.failedRecords]}>
                {recordsTotal - recordsInserted}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Retry Button for Failed APIs */}
      {canRetry && (
        <View style={styles.retryContainer}>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={onRetry}
            disabled={isRetrying}
          >
            <Text style={styles.retryButtonText}>
              {isRetrying ? 'Retrying...' : 'Retry Sync'}
            </Text>
          </TouchableOpacity>
          {retryCount > 0 && (
            <Text style={styles.retryCount}>
              Attempts: {retryCount}/{MAX_RETRY_ATTEMPTS}
            </Text>
          )}
        </View>
      )}

      {/* Expanded Content for Error/Insertion Failure Cards */}
      {isExpanded && canExpand && (
        <View style={styles.expandedContent}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorLabel}>Error Details:</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.timingContainer}>
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>Started:</Text>
              <Text style={styles.timingValue}>{formatTimestamp(startTime)}</Text>
            </View>
            {endTime && (
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Completed:</Text>
                <Text style={styles.timingValue}>{formatTimestamp(endTime)}</Text>
              </View>
            )}
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>Duration:</Text>
              <Text style={styles.timingValue}>{formatDuration(startTime, endTime)}</Text>
            </View>
          </View>

          {lastRetryTime && (
            <View style={styles.retryInfo}>
              <Text style={styles.retryInfoLabel}>Last Retry:</Text>
              <Text style={styles.retryInfoValue}>
                {formatTimestamp(lastRetryTime)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const MAX_RETRY_ATTEMPTS = 3;

export default ActivityCard;
