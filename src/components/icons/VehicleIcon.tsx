import React from 'react';
import { View } from 'react-native';
import IconComponent from './IconComponent';

interface VehicleIconProps {
  size?: number;
  color?: string;
}

export const VehicleIcon: React.FC<VehicleIconProps> = ({ 
  size = 20, 
  color = '#1e3a8a' 
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <IconComponent 
        name="truck" 
        size={size} 
        color={color}
      />
    </View>
  );
};
