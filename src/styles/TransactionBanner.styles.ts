import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';

export const createTransactionBannerStyles = (theme: Theme) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scale(60) : scale(40),
    left: scale(16),
    right: scale(16),
    borderRadius: scale(8),
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    maxHeight: scale(120), // Prevent banner from being too tall
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    minHeight: scale(48), // Ensure minimum height
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    minHeight: scale(32), // Ensure text container has minimum height
  },
  title: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: scale(2),
  },
  message: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    lineHeight: moderateScale(16),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
    minHeight: scale(24), // Ensure button has minimum height
  },
  retryButtonText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  dismissButton: {
    padding: scale(4),
    minHeight: scale(24), // Ensure button has minimum height
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingBottom: scale(8),
    gap: scale(8),
  },
  progressBar: {
    flex: 1,
    height: scale(3),
    backgroundColor: theme.colors.border,
    borderRadius: scale(1.5),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: scale(1.5),
  },
  progressText: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    minWidth: scale(30),
    textAlign: 'right',
  },
});

// Status-specific color configurations
export const getStatusColors = (status: 'uploading' | 'success' | 'error' | 'offline', theme: Theme) => {
  const baseConfig = {
    icon: 'info' as const,
    iconColor: theme.colors.text,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  };

  switch (status) {
    case 'uploading':
      return {
        ...baseConfig,
        icon: 'cloudUpload' as const,
        iconColor: theme.colors.primary,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.primary,
      };
    case 'success':
      return {
        ...baseConfig,
        icon: 'checkCircle' as const,
        iconColor: '#10B981',
        backgroundColor: theme.colors.background === '#121212' ? '#064E3B' : '#F0FDF4',
        borderColor: '#10B981',
      };
    case 'error':
      return {
        ...baseConfig,
        icon: 'error' as const,
        iconColor: '#EF4444',
        backgroundColor: theme.colors.background === '#121212' ? '#7F1D1D' : '#FEF2F2',
        borderColor: '#EF4444',
      };
    case 'offline':
      return {
        ...baseConfig,
        icon: 'cloudOff' as const,
        iconColor: '#F59E0B',
        backgroundColor: theme.colors.background === '#121212' ? '#78350F' : '#FFFBEB',
        borderColor: '#F59E0B',
      };
    default:
      return baseConfig;
  }
};
