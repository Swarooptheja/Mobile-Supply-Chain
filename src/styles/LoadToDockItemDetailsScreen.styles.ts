import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Theme } from '../context/ThemeContext';
import { COLORS, getThemeColors, getButtonColor, getHeaderColor } from './global.styles';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createLoadToDockItemDetailsScreenStyles = (theme: Theme) => {
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
      paddingBottom: scale(100), // Add bottom padding to prevent content from being hidden behind button
    },
    itemDetailsContainer: {
      paddingHorizontal: scale(16),
      paddingTop: scale(24),
      paddingBottom: scale(16),
      // Responsive adjustments
      ...(isTablet && {
        paddingHorizontal: scale(24),
        paddingTop: scale(28),
        paddingBottom: scale(20),
      }),
      ...(isDesktop && {
        paddingHorizontal: scale(32),
        paddingTop: scale(32),
        paddingBottom: scale(24),
      }),
    },
    bottomButtonContainer: {
      paddingHorizontal: scale(20),
      paddingTop: scale(20),
      paddingBottom: scale(40),
      backgroundColor: 'transparent',
      // Responsive adjustments
      ...(isTablet && {
        paddingHorizontal: scale(24),
        paddingTop: scale(24),
        paddingBottom: scale(48),
      }),
      ...(isDesktop && {
        paddingHorizontal: scale(32),
        paddingTop: scale(28),
        paddingBottom: scale(56),
      }),
    },
    saveButton: {
      backgroundColor: getButtonColor(),
      shadowColor: getButtonColor(),
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    saveButtonText: {
      color: themeColors.textWhite,
      fontSize: moderateScale(15),
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    activeTabIcon: {
      color: themeColors.textWhite,
    },
    activeTabLabel: {
      color: themeColors.textWhite,
    },
  });
};

