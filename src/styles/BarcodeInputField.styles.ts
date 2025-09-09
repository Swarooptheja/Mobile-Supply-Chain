import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export const createBarcodeInputFieldStyles = (themeColors: any, headerButtonSize: number) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: themeColors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: themeColors.border,
    backgroundColor: themeColors.surface,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48, // Match the header button size for better alignment
    justifyContent: 'center',
    // Enhanced shadow for better visibility
    shadowColor: themeColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  inputContainerDisabled: {
    backgroundColor: themeColors.disabled,
    borderColor: themeColors.borderDisabled,
  },
  inputContainerProcessing: {
    borderColor: themeColors.primary,
    shadowColor: themeColors.primary,
    shadowOpacity: 0.2,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    height: 32, // Adjusted to fit better in the 48px container
    marginLeft: 12,
    color: themeColors.textPrimary,
    fontWeight: '500', // Slightly bolder for better readability
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4,
  },
});
