import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { CommonIcon } from './index';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/global.styles';
import { useResponsive } from '../hooks/useResponsive';
import { createBarcodeInputFieldStyles } from '../styles/BarcodeInputField.styles';

interface IBarcodeInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBarcodeScanned?: (barcode: string) => void;
  onScanComplete?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const BarcodeInputFieldComponent: React.FC<IBarcodeInputFieldProps> = ({
  value,
  onChangeText,
  onBarcodeScanned,
  onScanComplete,
  placeholder = 'Scan or enter barcode',
  autoFocus = false,
  disabled = false,
  label: _label,
  error,
  onFocus,
  onBlur,
}) => {
  const theme = useTheme();
  const { headerButtonSize } = useResponsive();
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  const styles = createBarcodeInputFieldStyles(themeColors, headerButtonSize);
  const inputRef = useRef<TextInput>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto focus on mount
  useEffect(() => {
    if (autoFocus && !disabled) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only process if there's text and onBarcodeScanned callback
    if (text.trim() && onBarcodeScanned) {
      // Set new timer for debouncing without blocking input
      debounceTimerRef.current = setTimeout(() => {
        // Process any non-empty barcode (removed length restriction)
        if (text.trim().length > 0) {
          setIsProcessing(true);
          onBarcodeScanned(text.trim());
          // Call scan complete callback and clear input after processing
          setTimeout(() => {
            setIsProcessing(false);
            onScanComplete?.();
            onChangeText(''); // Clear the input field
          }, 1000);
        }
      }, 700);
    } else if (!text.trim()) {
      // Reset processing state when input is cleared
      setIsProcessing(false);
    }
  }, [onChangeText, onBarcodeScanned, onScanComplete]);

  const handleClear = useCallback(() => {
    // Clear the debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Reset processing state
    setIsProcessing(false);
    // Clear the input
    onChangeText('');
    inputRef.current?.focus();
  }, [onChangeText]);

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError,
        disabled && styles.inputContainerDisabled,
        isProcessing && styles.inputContainerProcessing
      ]}>
         <CommonIcon 
           icon="barcode"
           size={20} 
           color={isProcessing ? themeColors.primary : themeColors.textSecondary}
         />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleTextChange}
          placeholder={isProcessing ? "Processing barcode..." : placeholder}
          placeholderTextColor={themeColors.textSecondary}
          style={styles.input}
          autoFocus={autoFocus}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          clearButtonMode="while-editing"
          selectTextOnFocus
        />
        {!!value && !disabled && (
          <TouchableOpacity 
            onPress={handleClear} 
            style={styles.clearButton}
            accessibilityRole="button" 
            accessibilityLabel="Clear barcode"
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Export the component
export const BarcodeInputField = BarcodeInputFieldComponent;
export default BarcodeInputField;
