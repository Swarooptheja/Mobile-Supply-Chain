import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { VehicleIcon } from './icons/VehicleIcon';

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
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.labelContainer}>
      <VehicleIcon size={20} color={theme.colors.primary} />
      <Text style={[styles.labelText, { color: theme.colors.primary }]}>
        Vehicle#
      </Text>
    </View>
    <TextInput
      style={[
        styles.input,
        {
          borderColor: isFocused ? theme.colors.primary : '#d1d5db',
        },
        !vehicleNumber.trim() && styles.inputRequired
      ]}
      value={vehicleNumber}
      onChangeText={onVehicleNumberChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Enter Vehicle Number"
      placeholderTextColor="#9ca3af"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  inputRequired: {
    borderColor: '#f87171',
  },
});
