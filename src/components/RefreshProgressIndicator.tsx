import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { IRefreshProgress } from '../services/apiRefreshService';

interface RefreshProgressIndicatorProps {
  progress: IRefreshProgress;
  visible: boolean;
  showDetails?: boolean;
  style?: any;
}

export const RefreshProgressIndicator: React.FC<RefreshProgressIndicatorProps> = ({
  progress,
  visible,
  showDetails = true,
  style
}) => {
  const theme = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animatedValue]);

  if (!visible) return null;

  const formatTime = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    const seconds = Math.round(milliseconds / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getApiTypeColor = (apiType?: string) => {
    switch (apiType) {
      case 'master':
        return theme.colors.primary;
      case 'config':
        return theme.colors.secondary;
      case 'transactional':
        return theme.colors.accent;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getApiTypeLabel = (apiType?: string) => {
    switch (apiType) {
      case 'master':
        return 'Master Data';
      case 'config':
        return 'Configuration';
      case 'transactional':
        return 'Transactional';
      default:
        return 'API';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            })
          }]
        },
        style
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator 
          size="small" 
          color={theme.colors.primary} 
          style={styles.indicator}
        />
        
        <View style={styles.textContainer}>
          <Text style={[styles.primaryText, { color: theme.colors.text }]}>
            Refreshing data... {Math.round(progress.percentage)}%
          </Text>
          
          {showDetails && (
            <>
              <Text style={[styles.secondaryText, { color: theme.colors.textSecondary }]}>
                {progress.current} of {progress.total} APIs
              </Text>
              
              {progress.currentApi && (
                <View style={styles.apiInfo}>
                  <View 
                    style={[
                      styles.apiTypeIndicator, 
                      { backgroundColor: getApiTypeColor(progress.currentApiType) }
                    ]} 
                  />
                  <Text style={[styles.apiText, { color: theme.colors.text }]}>
                    {progress.currentApi}
                  </Text>
                  {progress.currentApiType && (
                    <Text style={[styles.apiTypeText, { color: getApiTypeColor(progress.currentApiType) }]}>
                      {getApiTypeLabel(progress.currentApiType)}
                    </Text>
                  )}
                </View>
              )}
              
              {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
                <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                  ~{formatTime(progress.estimatedTimeRemaining)} remaining
                </Text>
              )}
            </>
          )}
        </View>
      </View>
      
      {/* Progress bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.colors.primary,
              width: `${progress.percentage}%`
            }
          ]} 
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  indicator: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  secondaryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  apiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  apiTypeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  apiText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  apiTypeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  progressBarContainer: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 1.5,
  },
});
