import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CommonIcon } from './index';
import { headerStyles, headerColors } from '../styles/header.styles';

interface IRefreshButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

const RefreshButton: React.FC<IRefreshButtonProps> = ({
  onPress,
  size = 40,
  color = headerColors.icon, // Use consistent header icon color
  backgroundColor = 'transparent', // Transparent background for better header consistency
  style
}) => {
  return (
    <TouchableOpacity
      style={[
        headerStyles.headerIconButton,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CommonIcon 
        icon="refresh"
        size={size * 0.45} 
        color={color}
      />
    </TouchableOpacity>
  );
};

export default RefreshButton;
