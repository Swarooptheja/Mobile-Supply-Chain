import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device type detection
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;
const isSmallDevice = screenWidth <= 375;

export const createSettingsScreenStyles = (theme: Theme) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Same as header color
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: isDesktop ? 32 : isTablet ? 28 : 24,
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
    marginTop: -20, // Overlap with header for better visual
  },
    profileAvatar: {
      width: isDesktop ? 100 : isTablet ? 90 : 80,
      height: isDesktop ? 100 : isTablet ? 90 : 80,
      borderRadius: isDesktop ? 50 : isTablet ? 45 : 40,
      backgroundColor: theme.colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isDesktop ? 16 : isTablet ? 14 : 12,
    },
    profileInitials: {
      fontSize: isDesktop ? 40 : isTablet ? 36 : 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    profileName: {
      fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
      fontWeight: '600',
      color: theme.colors.white,
    },
    settingsCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: isDesktop ? 32 : isTablet ? 24 : 20,
      marginTop: -20, // Overlap with header
      borderRadius: isDesktop ? 16 : isTablet ? 14 : 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: isDesktop ? 8 : isTablet ? 6 : 4,
      elevation: isDesktop ? 8 : isTablet ? 6 : 5,
    },
    settingsTitle: {
      fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      paddingHorizontal: isDesktop ? 28 : isTablet ? 24 : 20,
      paddingTop: isDesktop ? 28 : isTablet ? 24 : 20,
      paddingBottom: isDesktop ? 16 : isTablet ? 14 : 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: isDesktop ? 28 : isTablet ? 24 : 20,
      paddingVertical: isDesktop ? 20 : isTablet ? 18 : 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
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
      width: isDesktop ? 28 : isTablet ? 26 : 24,
      height: isDesktop ? 28 : isTablet ? 26 : 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isDesktop ? 20 : isTablet ? 18 : 16,
    },
    settingTitle: {
      fontSize: isDesktop ? 18 : isTablet ? 17 : 16,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    settingRight: {
      marginLeft: isDesktop ? 20 : isTablet ? 18 : 16,
    },
    languageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageText: {
      fontSize: isDesktop ? 18 : isTablet ? 17 : 16,
      color: theme.colors.textSecondary,
      marginRight: isDesktop ? 12 : isTablet ? 10 : 8,
    },
    logoutButtonsContainer: {
      marginHorizontal: isDesktop ? 32 : isTablet ? 24 : 20,
      marginTop: isDesktop ? 28 : isTablet ? 24 : 20,
      gap: isDesktop ? 16 : isTablet ? 14 : 12,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#6c757d',
      paddingVertical: isDesktop ? 20 : isTablet ? 18 : 16,
      borderRadius: isDesktop ? 12 : isTablet ? 10 : 8,
    },
    logoutButtonText: {
      color: theme.colors.white,
      fontSize: isDesktop ? 18 : isTablet ? 17 : 16,
      fontWeight: '600',
      marginLeft: isDesktop ? 12 : isTablet ? 10 : 8,
    },
    clearDbButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#dc3545',
      paddingVertical: isDesktop ? 20 : isTablet ? 18 : 16,
      borderRadius: isDesktop ? 12 : isTablet ? 10 : 8,
    },
    clearDbButtonText: {
      color: theme.colors.white,
      fontSize: isDesktop ? 18 : isTablet ? 17 : 16,
      fontWeight: '600',
      marginLeft: isDesktop ? 12 : isTablet ? 10 : 8,
    },
    disabledButton: {
      opacity: 0.6,
    },
    versionText: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: isDesktop ? 20 : isTablet ? 18 : 16,
      marginBottom: isDesktop ? 140 : isTablet ? 130 : 120, // Responsive margin for bottom navigation
    },
    // Dropdown Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: isDesktop ? 16 : isTablet ? 14 : 12,
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      marginHorizontal: isDesktop ? 40 : isTablet ? 32 : 20,
      minWidth: isDesktop ? 300 : isTablet ? 280 : 250,
      maxWidth: 400,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: theme.isDark ? 0.4 : 0.2,
      shadowRadius: 8,
      elevation: 10,
    },
    dropdownTitle: {
      fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: isDesktop ? 20 : isTablet ? 16 : 12,
      textAlign: 'center',
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: isDesktop ? 16 : isTablet ? 14 : 12,
      paddingHorizontal: isDesktop ? 16 : isTablet ? 14 : 12,
      borderRadius: isDesktop ? 8 : isTablet ? 6 : 4,
      marginBottom: isDesktop ? 8 : isTablet ? 6 : 4,
    },
    dropdownItemSelected: {
      backgroundColor: theme.colors.primary + '20', // 20% opacity
    },
    dropdownItemText: {
      fontSize: isDesktop ? 18 : isTablet ? 17 : 16,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    dropdownItemTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
};
