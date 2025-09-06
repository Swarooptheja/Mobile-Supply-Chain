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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: scale(16),
    minHeight: scale(64), // Ensure consistent height for alignment
    // Responsive spacing
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingVertical: scale(20),
      gap: scale(20),
      minHeight: scale(72),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      paddingVertical: scale(24),
      gap: scale(24),
      minHeight: scale(80),
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
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
    // Responsive spacing
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingTop: scale(20),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
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
