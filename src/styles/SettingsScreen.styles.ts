import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device type detection with more granular breakpoints
const isSmallMobile = screenWidth <= 375;
const isMobile = screenWidth > 375 && screenWidth <= 768;
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;
const isLargeDesktop = screenWidth > 1440;

// Responsive values
const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
  if (isDesktop) return desktop;
  if (isTablet) return tablet;
  return mobile;
};

const getResponsiveFontSize = (mobile: number, tablet: number, desktop: number) => {
  if (isLargeDesktop) return desktop + 2;
  if (isDesktop) return desktop;
  if (isTablet) return tablet;
  return mobile;
};

export const createSettingsScreenStyles = (theme: Theme) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: getResponsiveValue(24, 32, 40),
    backgroundColor: theme.colors.background,
    paddingTop: getResponsiveValue(20, 24, 32),
    paddingHorizontal: getResponsiveValue(16, 24, 32),
  },
    profileAvatar: {
      width: getResponsiveValue(80, 96, 112),
      height: getResponsiveValue(80, 96, 112),
      borderRadius: getResponsiveValue(40, 48, 56),
      backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getResponsiveValue(12, 16, 20),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: getResponsiveValue(2, 4, 6),
      },
      shadowOpacity: theme.isDark ? 0.3 : 0.15,
      shadowRadius: getResponsiveValue(4, 6, 8),
      elevation: getResponsiveValue(4, 6, 8),
    },
    profileName: {
      fontSize: getResponsiveFontSize(18, 20, 22),
      fontWeight: '600',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      maxWidth: '100%',
    },
    settingsCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: getResponsiveValue(0, 16, 32),
      marginTop: getResponsiveValue(0, 8, 16),
      borderRadius: getResponsiveValue(0, 12, 16),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: getResponsiveValue(2, 4, 6),
      },
      shadowOpacity: theme.isDark ? 0.2 : 0.1,
      shadowRadius: getResponsiveValue(4, 6, 8),
      elevation: getResponsiveValue(2, 4, 6),
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getResponsiveValue(20, 24, 32),
      paddingVertical: getResponsiveValue(16, 20, 24),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      minHeight: getResponsiveValue(56, 64, 72),
    },
    lastSettingItem: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIconContainer: {
      width: getResponsiveValue(24, 28, 32),
      height: getResponsiveValue(24, 28, 32),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: getResponsiveValue(16, 20, 24),
    },
    settingTitle: {
      fontSize: getResponsiveFontSize(16, 17, 18),
      color: theme.colors.textPrimary,
      fontWeight: '500',
      flex: 1,
    },
    destructiveText: {
      color: theme.colors.error || '#ef4444',
    },
    settingRight: {
      marginLeft: getResponsiveValue(12, 16, 20),
    },
    languageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageText: {
      fontSize: getResponsiveFontSize(15, 16, 17),
      color: theme.colors.textSecondary,
      marginRight: getResponsiveValue(6, 8, 10),
      fontWeight: '500',
    },
    versionText: {
      fontSize: getResponsiveFontSize(12, 14, 16),
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: getResponsiveValue(20, 24, 32),
      marginBottom: getResponsiveValue(24, 32, 40),
      marginHorizontal: getResponsiveValue(16, 24, 32),
      fontWeight: '500',
    },
    // Dropdown Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: getResponsiveValue(12, 16, 20),
      padding: getResponsiveValue(20, 24, 32),
      marginHorizontal: getResponsiveValue(24, 32, 48),
      minWidth: getResponsiveValue(280, 320, 360),
      maxWidth: getResponsiveValue(350, 400, 450),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: getResponsiveValue(8, 12, 16),
      },
      shadowOpacity: theme.isDark ? 0.4 : 0.25,
      shadowRadius: getResponsiveValue(16, 20, 24),
      elevation: getResponsiveValue(16, 20, 24),
    },
    dropdownTitle: {
      fontSize: getResponsiveFontSize(16, 18, 20),
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: getResponsiveValue(16, 20, 24),
      textAlign: 'center',
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: getResponsiveValue(14, 16, 18),
      paddingHorizontal: getResponsiveValue(14, 16, 18),
      borderRadius: getResponsiveValue(8, 10, 12),
      marginBottom: getResponsiveValue(2, 4, 6),
    },
    dropdownItemSelected: {
      backgroundColor: theme.colors.primary + '20', // 20% opacity
    },
    dropdownItemText: {
      fontSize: getResponsiveFontSize(15, 16, 17),
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    dropdownItemTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
};
