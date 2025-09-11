import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { IActivity } from '../types/activity';
import { createNotificationCenterStyles } from '../styles/NotificationCenter.styles';

interface NotificationCenterProps {
  activities: IActivity[];
}

interface INotification {
  id: string;
  timestamp: Date;
  apiName: string;
  errorReason: string;
  affectedRecords: {
    total: number;
    inserted: number;
    failed: number;
  };
  type: 'error' | 'insertion_failure';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ activities }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createNotificationCenterStyles(theme);

  const notifications = useMemo((): INotification[] => {
    const result: INotification[] = [];

    activities.forEach(activity => {
      // Show API failures
      if (activity.status === 'error' || activity.status === 'failure') {
        result.push({
          id: `${activity.id}_error`,
          timestamp: activity.endTime || new Date(),
          apiName: activity.name || 'Unknown API',
          errorReason: activity.error || 'Unknown error',
          affectedRecords: {
            total: activity.recordsTotal || 0,
            inserted: 0,
            failed: activity.recordsTotal || 0,
          },
          type: 'error',
        });
      }
      
      // Show insertion failures (when some records failed to insert)
      if (activity.status === 'success' && 
          (activity.recordsTotal || 0) > 0 && 
          (activity.recordsInserted || 0) < (activity.recordsTotal || 0)) {
        result.push({
          id: `${activity.id}_insertion_failure`,
          timestamp: activity.endTime || new Date(),
          apiName: activity.name || 'Unknown API',
          errorReason: t('notifications.partialDataInsertionFailure'),
          affectedRecords: {
            total: activity.recordsTotal || 0,
            inserted: activity.recordsInserted || 0,
            failed: (activity.recordsTotal || 0) - (activity.recordsInserted || 0),
          },
          type: 'insertion_failure',
        });
      }
    });

    // Sort by timestamp (most recent first)
    return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activities]);

  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (type: 'error' | 'insertion_failure') => {
    return type === 'error' ? '❌' : '⚠️';
  };

  const getNotificationStyle = (type: 'error' | 'insertion_failure') => {
    return type === 'error' ? styles.errorNotification : styles.warningNotification;
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('notifications.justNow');
    if (diffMins < 60) return t('notifications.minutesAgo', { minutes: diffMins });
    if (diffHours < 24) return t('notifications.hoursAgo', { hours: diffHours });
    if (diffDays < 7) return t('notifications.daysAgo', { days: diffDays });
    return date.toLocaleDateString();
  };

  const formatRecordsSummary = (records: { total: number; inserted: number; failed: number }) => {
    if (records.total === 0) return t('notifications.noRecords');
    
    if (records.failed === 0) {
      return t('notifications.recordsInserted', { count: records.inserted });
    }
    
    return t('notifications.recordsInsertedFailed', { inserted: records.inserted, failed: records.failed });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('notifications.issuesFound', { count: notifications.length, plural: notifications.length !== 1 ? 's' : '' })}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t('notifications.apiFailuresInsertionIssues', { 
            apiFailures: notifications.filter(n => n.type === 'error').length,
            insertionIssues: notifications.filter(n => n.type === 'insertion_failure').length
          })}
        </Text>
      </View>

      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsContent}
      >
        {notifications.map((notification) => (
          <View 
            key={notification.id} 
            style={[styles.notificationItem, getNotificationStyle(notification.type)]}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </Text>
              <View style={styles.notificationTitleContainer}>
                <Text style={styles.notificationTitle}>
                  {notification.apiName || t('notifications.unknownApi')}
                </Text>
                <Text style={styles.notificationTimestamp}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </View>
            </View>

            <Text style={styles.errorReason}>
              {notification.errorReason || t('notifications.noErrorDetailsAvailable')}
            </Text>

            <View style={styles.recordsInfo}>
              <Text style={styles.recordsLabel}>{t('notifications.affectedRecords')}:</Text>
              <Text style={styles.recordsValue}>
                {formatRecordsSummary(notification.affectedRecords)}
              </Text>
            </View>

            {notification.affectedRecords.total > 0 && (
              <View style={styles.recordsBreakdown}>
                <View style={styles.recordStat}>
                  <Text style={styles.recordStatLabel}>{t('notifications.total')}:</Text>
                  <Text style={styles.recordStatValue}>
                    {notification.affectedRecords.total}
                  </Text>
                </View>
                <View style={styles.recordStat}>
                  <Text style={styles.recordStatLabel}>{t('notifications.inserted')}:</Text>
                  <Text style={styles.recordStatValue}>
                    {notification.affectedRecords.inserted}
                  </Text>
                </View>
                <View style={styles.recordStat}>
                  <Text style={styles.recordStatLabel}>{t('notifications.failed')}:</Text>
                  <Text style={[styles.recordStatValue, styles.failedValue]}>
                    {notification.affectedRecords.failed}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationCenter;
