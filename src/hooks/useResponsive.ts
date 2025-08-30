import { useWindowDimensions } from 'react-native';

interface ResponsiveValues {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  headerButtonSize: number;
  headerButtonSpacing: number;
  headerHeight: number;
}

export const useResponsive = (): ResponsiveValues => {
  const { width } = useWindowDimensions();
  
  // Determine device size based on screen width
  const isSmallDevice = width < 375; // iPhone SE, small Android devices
  const isMediumDevice = width >= 375 && width < 768; // Most phones
  const isLargeDevice = width >= 768; // Tablets, large phones
  
  // Responsive header button sizing - slightly larger for better icon visibility
  const headerButtonSize = isSmallDevice ? 40 : isMediumDevice ? 44 : 48;
  const headerButtonSpacing = isSmallDevice ? 8 : isMediumDevice ? 10 : 12;
  const headerHeight = isSmallDevice ? 48 : isMediumDevice ? 52 : 56;
  
  return {
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    headerButtonSize,
    headerButtonSpacing,
    headerHeight,
  };
};
