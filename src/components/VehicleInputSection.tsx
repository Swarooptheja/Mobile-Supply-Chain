import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

interface VehicleInputSectionProps {
  vehicleNumber: string;
  onVehicleNumberChange: (text: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  theme: any;
  style?: any;
}

export const VehicleInputSection: React.FC<VehicleInputSectionProps> = ({
  vehicleNumber,
  onVehicleNumberChange,
  isFocused,
  onFocus,
  onBlur,
  theme,
  style
}) => {
  const { t } = useTranslation();
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.labelText, { color: theme.colors.textPrimary }]}>
          {t('loadToDock.vehicleNumber')} <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: isFocused ? theme.colors.primary : theme.colors.border,
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            // Add shadow styling to match SearchBar
            shadowColor: theme.colors.shadow,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          }
        ]}
        value={vehicleNumber}
        onChangeText={onVehicleNumberChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={t('loadToDock.enterVehicleNumber')}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12, // Reduced from 16 to 12 for more compact section
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Reduced from 8 to 4 to bring input closer to label
  },
  labelText: {
    fontSize: 14, // Reduced from 16 to 14 for smaller label
    fontWeight: '600', // Reduced from 700 to 600 for less bold text
  },
  requiredAsterisk: {
    color: '#dc2626', // Red color for asterisk
    fontWeight: '700',
  },
  input: {
    borderWidth: 2, // Match SearchBar border width
    borderRadius: 10, // Match SearchBar border radius
    paddingHorizontal: 16, // Match SearchBar horizontal padding
    paddingVertical: 14, // Match SearchBar vertical padding
    fontSize: 16, // Match SearchBar font size
    fontWeight: '400', // Normal weight to match SearchBar
    height: 52, // Match SearchBar container height
    // backgroundColor and color are now set dynamically based on theme
    // Shadow styling will be added dynamically in the component
  },
});
