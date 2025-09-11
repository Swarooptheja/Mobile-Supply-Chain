import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { CommonIcon } from './VectorIcon';
import { createTransactionBannerStyles, getStatusColors } from '../styles/TransactionBanner.styles';

export interface ITransactionBannerProps {
  visible: boolean;
  status: 'uploading' | 'success' | 'error' | 'offline';
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  showProgress?: boolean;
  progress?: number; // 0 to 100
  autoHide?: boolean;
  autoHideDelay?: number;
  testID?: string;
}

export const TransactionBanner: React.FC<ITransactionBannerProps> = React.memo(({
  visible,
  status,
  message,
  onDismiss,
  onRetry,
  showProgress = false,
  progress = 0,
  autoHide = false,
  autoHideDelay = 3000,
  testID = 'transaction-banner',
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get status configuration from styles file
  const statusConfig = useMemo(() => getStatusColors(status, theme), [status, theme]);
  
  // Get styles from dedicated styles file
  const styles = useMemo(() => createTransactionBannerStyles(theme), [theme]);

  // Handle auto-hide functionality
  useEffect(() => {
    if (visible && autoHide && (status === 'success' || status === 'offline')) {
      autoHideTimer.current = setTimeout(() => {
        onDismiss?.();
      }, autoHideDelay);
    }

    return () => {
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
        autoHideTimer.current = null;
      }
    };
  }, [visible, autoHide, status, autoHideDelay, onDismiss]);

  // Handle visibility animations
  useEffect(() => {
    if (visible) {
      // Reset values
      translateY.setValue(-100);
      opacity.setValue(0);
      progressWidth.setValue(0);

      // Show animation with spring effect
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate progress if showing progress
      if (showProgress && status === 'uploading') {
        Animated.timing(progressWidth, {
          toValue: Math.min(Math.max(progress, 0), 100),
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, progress, showProgress, status, translateY, opacity, progressWidth]);

  // Update progress when it changes
  useEffect(() => {
    if (visible && showProgress && status === 'uploading') {
      Animated.timing(progressWidth, {
        toValue: Math.min(Math.max(progress, 0), 100),
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, visible, showProgress, status, progressWidth]);

  // Memoize title text
  const titleText = useMemo(() => {
    const titles = {
      uploading: t('banner.uploadingDocuments'),
      success: t('banner.uploadComplete'),
      error: t('banner.uploadFailed'),
      offline: t('banner.savedOffline'),
    };
    return titles[status] || t('banner.processing');
  }, [status, t]);

  // Memoize progress text
  const progressText = useMemo(() => `${Math.round(Math.min(Math.max(progress, 0), 100))}%`, [progress]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleDismiss = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
    onDismiss?.();
  }, [onDismiss]);

  const handleRetry = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
    onRetry?.();
  }, [onRetry]);

  // Don't render if not visible
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: statusConfig.backgroundColor,
          borderColor: statusConfig.borderColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <CommonIcon
              icon={statusConfig.icon}
              size={20}
              color={statusConfig.iconColor}
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {titleText}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {status === 'error' && onRetry && (
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={handleRetry}
              testID={`${testID}-retry-button`}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>{t('ui.retry')}</Text>
            </TouchableOpacity>
          )}
          
          {onDismiss && (
            <TouchableOpacity 
              style={styles.dismissButton} 
              onPress={handleDismiss}
              testID={`${testID}-dismiss-button`}
              activeOpacity={0.7}
            >
              <CommonIcon
                icon="close"
                size={16}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showProgress && status === 'uploading' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: statusConfig.iconColor,
                  width: progressWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: statusConfig.iconColor }]}>
            {progressText}
          </Text>
        </View>
      )}
    </Animated.View>
  );
});

TransactionBanner.displayName = 'TransactionBanner';
