import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Theme } from '../context/ThemeContext';
import { COLORS, getButtonColor } from './global.styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createLoadToDockItemDetailsScreenStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 100, // Add bottom padding to prevent content from being hidden behind button
    // Responsive adjustments
    ...(isTablet && {
      paddingBottom: 120,
    }),
    ...(isDesktop && {
      paddingBottom: 140,
    }),
  },
  itemDetailsContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(24),
    paddingBottom: scale(32),
    // Responsive adjustments
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingTop: scale(28),
      paddingBottom: scale(36),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      paddingTop: scale(32),
      paddingBottom: scale(40),
    }),
  },
  tabsContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingBottom: scale(32),
    marginBottom: scale(20), // Add margin to ensure content doesn't overlap with button
    // Responsive adjustments
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingBottom: scale(36),
      marginBottom: scale(24),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      paddingBottom: scale(40),
      marginBottom: scale(28),
    }),
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: scale(20),
    // Responsive adjustments
    ...(isTablet && {
      paddingBottom: scale(24),
    }),
    ...(isDesktop && {
      paddingBottom: scale(28),
    }),
  },
  mediaCaptureArea: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  bottomButtonContainer: {
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(40), // Increased bottom padding to move button up
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.surface : '#f3f4f6', // Theme-aware background
    borderTopWidth: 1,
    borderTopColor: theme.colors.border, // Theme-aware border color
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
    backgroundColor: getButtonColor(), // Use global button color function
    paddingVertical: scale(18),
    borderRadius: scale(12),
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    // Responsive adjustments
    ...(isTablet && {
      paddingVertical: scale(20),
      borderRadius: scale(14),
    }),
    ...(isDesktop && {
      paddingVertical: scale(22),
      borderRadius: scale(16),
    }),
  },
  disabledButton: {
    backgroundColor: getButtonColor(), // Use same color as enabled button for consistency
    paddingVertical: scale(18),
    borderRadius: scale(12),
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    opacity: 0.5, // Add opacity to indicate disabled state
    // Responsive adjustments
    ...(isTablet && {
      paddingVertical: scale(20),
      borderRadius: scale(14),
    }),
    ...(isDesktop && {
      paddingVertical: scale(22),
      borderRadius: scale(16),
    }),
  },
  saveButtonText: {
    color: COLORS.TEXT_WHITE, // Use global white text color
    fontSize: moderateScale(17),
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(18),
      letterSpacing: 0.4,
    }),
    ...(isDesktop && {
      fontSize: moderateScale(19),
      letterSpacing: 0.5,
    }),
  },
  activeTabIcon: {
    color: COLORS.TEXT_WHITE, // Use global white text color
  },
  activeTabLabel: {
    color: COLORS.TEXT_WHITE, // Use global white text color
  },
});

