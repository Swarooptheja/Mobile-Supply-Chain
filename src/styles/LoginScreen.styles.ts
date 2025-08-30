import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper functions for responsive sizing
const scale = (size: number) => (size * screenWidth) / 375;
const verticalScale = (size: number) => (size * screenHeight) / 812;
const moderateScale = (size: number, factor: number = 0.5) => size + (scale(size) - size) * factor;

// Device size detection
const isSmallDevice = screenWidth <= 375;
const isTablet = screenWidth > 768;

// Create styles function that accepts theme
export const createLoginScreenStyles = (theme: Theme) => StyleSheet.create({
  // LoginScreen Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Keyboard Avoiding View
  keyboardView: {
    flex: 1,
  },
  
  // Content Container - Responsive padding and spacing
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(25),
    paddingHorizontal: scale(20),
    justifyContent: 'space-between', // Better distribution of space
  },
  
  // Login Card - Responsive sizing and positioning
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: scale(16),
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
    width: isTablet ? Math.min(screenWidth * 0.6, 500) : screenWidth * 0.9,
    maxWidth: isTablet ? 500 : 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: verticalScale(40), // Reduced margin for better spacing
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 4,
    // Responsive margins for different screen sizes
    marginHorizontal: isSmallDevice ? scale(16) : scale(20),
  },
  
  cardTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: verticalScale(32), // Increased margin for better visual separation
  },
  
  // Input Container - Responsive spacing
  inputContainer: {
    marginBottom: verticalScale(24), // Increased spacing between inputs
  },
  
  inputLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: verticalScale(10), // Slightly increased for better readability
  },
  
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: scale(8),
    paddingHorizontal: scale(16), // Increased horizontal padding
    paddingVertical: verticalScale(12), // Increased vertical padding
    minHeight: verticalScale(48), // Slightly increased for better touch targets
    // Ensure consistent appearance for both username and password fields
    justifyContent: 'space-between',
  },
  
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    color: theme.colors.textPrimary,
    paddingVertical: verticalScale(4), // Increased for better text positioning
    fontWeight: '500',
    // Ensure consistent text input styling
    minHeight: verticalScale(20),
    textAlignVertical: 'center',
  },
  
  eyeIcon: {
    paddingHorizontal: scale(8), // Increased padding
    paddingVertical: verticalScale(8), // Increased padding
    minWidth: scale(44), // Ensure touch target is large enough
    minHeight: verticalScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    // Ensure the eye icon doesn't affect input field layout
    marginLeft: scale(8),
  },
  
  errorText: {
    color: '#EF4444',
    fontSize: moderateScale(11),
    marginTop: verticalScale(4),
    marginLeft: scale(4),
    fontWeight: '500',
  },
  
  // Login Button - Responsive sizing
  loginButton: {
    marginTop: verticalScale(32), // Increased margin for better separation
    height: verticalScale(52), // Slightly increased height
    minHeight: verticalScale(44), // Ensure touch target is large enough
  },

  loginButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  
  // Bottom Section - Responsive positioning and spacing
  bottom: {
    alignItems: 'center',
    paddingHorizontal: scale(20),
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(30), // Increased bottom padding
    paddingTop: verticalScale(20), // Added top padding for better spacing
  },
  
  // Company Section
  company: {
    alignItems: 'center',
  },
  
  logo: {
    alignItems: 'center',
  },
  
  logoImage: {
    width: isTablet ? scale(160) : scale(120),
    height: isTablet ? scale(160) : scale(120),
    marginBottom: verticalScale(20), // Increased margin for better spacing
    // Ensure logo doesn't get too large on very small screens
    maxWidth: Math.min(screenWidth * 0.3, 160),
    maxHeight: Math.min(screenHeight * 0.2, 160),
  },
  
  brand: {
    alignItems: 'flex-start',
  },
  
  brandText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(3),
  },
  
  brandPrimary: {
    color: theme.colors.textPrimary,
  },
  
  brandSecondary: {
    color: theme.colors.textSecondary,
  },
  
  tagline: {
    fontSize: moderateScale(12),
    color: '#FF8C00',
    fontWeight: '600',
  },
  
  // Version Text
  version: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(30),
    fontWeight: '500',
  },



  // Small device adjustments
  smallDeviceCard: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    marginHorizontal: scale(8),
  },

  smallDeviceTitle: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(16),
  },

  // Tablet adjustments
  tabletCard: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(32),
    marginHorizontal: scale(40),
  },

  tabletTitle: {
    fontSize: moderateScale(28),
    marginBottom: verticalScale(32),
  },
});

// Default styles for when theme is not available
export const defaultLoginScreenStyles = createLoginScreenStyles({
  colors: {
    background: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    primary: '#1e3a8a',
    border: '#e5e7eb',
    separator: '#e5e7eb',
    pillBg: '#f3f4f6',
    pillBgSelected: '#dbeafe',
    pillText: '#374151',
    pillTextSelected: '#1d4ed8',
    buttonBg: '#2563eb',
    buttonText: '#ffffff',
    radioBorder: '#9ca3af',
  },
});
