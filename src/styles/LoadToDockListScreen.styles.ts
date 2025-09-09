import { StyleSheet, Dimensions } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth } = Dimensions.get('window');

// Device type detection
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createLoadToDockListStyles = (theme: any, isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcodeSection: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    // Responsive spacing
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingVertical: scale(10),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      paddingVertical: scale(12),
    }),
  },
  barcodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Center align for proper alignment
    gap: scale(12),
    // Responsive spacing
    ...(isTablet && {
      gap: scale(14),
    }),
    ...(isDesktop && {
      gap: scale(16),
    }),
  },
  searchButton: {
    // Remove marginBottom to center align with input field
  },
  searchButtonActive: {
    backgroundColor: '#1e3a8a',
    borderRadius: scale(8),
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: scale(12),
    minHeight: scale(48), // Match the input field height
    // Responsive spacing
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingVertical: scale(10),
      gap: scale(14),
      minHeight: scale(52),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      paddingVertical: scale(12),
      gap: scale(16),
      minHeight: scale(56),
    }),
  },
  searchBarContainer: {
    flex: 1,
    height: scale(48),
    justifyContent: 'center',
    // Responsive sizing
    ...(isTablet && {
      height: scale(52),
    }),
    ...(isDesktop && {
      height: scale(56),
    }),
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: scale(8), // Further reduced to maximize card width
    paddingTop: scale(16),
    // Responsive spacing
    ...(isTablet && {
      paddingHorizontal: scale(12), // Further reduced for tablets
      paddingTop: scale(20),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(16), // Further reduced for desktop
      paddingTop: scale(24),
    }),
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingBottom: scale(20),
    // Responsive spacing
    ...(isTablet && {
      paddingBottom: scale(24),
    }),
    ...(isDesktop && {
      paddingBottom: scale(32),
    }),
  },
});
