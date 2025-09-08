
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { CommonIcon } from './index';
import { useResponsive } from '../hooks/useResponsive';
import { headerStyles, headerColors } from '../styles/header.styles';

export interface IHeaderButtonProps {
  onPress: () => void;
  icon: keyof typeof import('./VectorIcon').CommonIcons;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  testID?: string;
  disabled?: boolean;
}

const HeaderButton: React.FC<IHeaderButtonProps> = ({
  onPress,
  icon,
  size,
  color = headerColors.icon, // Use consistent header icon color
  backgroundColor = 'transparent', // Transparent background for better header consistency
  style,
  testID,
  disabled = false
}) => {
  const { headerButtonSize } = useResponsive();
  const buttonSize = size || Math.max(40, headerButtonSize * 0.7); // Slightly larger buttons

  return (
    <TouchableOpacity
      style={[
        headerStyles.headerIconButton,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      testID={testID}
      disabled={disabled}
    >
      <CommonIcon 
        icon={icon}
        size={buttonSize * 0.6} // Larger icon size for better visibility
        color={disabled ? color + '80' : color} // Add transparency for disabled state
      />
    </TouchableOpacity>
  );
};

export default HeaderButton;
