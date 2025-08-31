import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ColorScheme = 'primary' | 'teal' | 'danger' | 'neutral';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  colorScheme?: ColorScheme;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  size = 'md',
  variant = 'solid',
  colorScheme = 'primary',
  fullWidth,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  const { bgColor, borderColor, textColor } = getColors(theme, variant, colorScheme);
  const { paddingV, paddingH, borderRadius, fontSize } = getSizing(size);

  const baseButton: ViewStyle = {
    backgroundColor: bgColor,
    borderColor,
    borderWidth: variant === 'outline' ? 1 : 0,
    paddingVertical: paddingV,
    paddingHorizontal: paddingH,
    borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'auto',
    opacity: disabled ? 0.6 : 1,
    flexDirection: 'row',
    gap: 8,
  };

  const baseText: TextStyle = {
    color: textColor,
    fontSize,
    fontWeight: '600',
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      onPress={onPress}
      disabled={disabled || loading}
      style={[baseButton, style]}
      activeOpacity={0.8}
    >
      {leftIcon ? <View style={{ marginRight: 6 }}>{leftIcon}</View> : null}
      {loading ? (
        <ActivityIndicator color={textColor as string} size="small" />
      ) : (
        <Text style={[baseText, textStyle]}>{title}</Text>
      )}
      {rightIcon ? <View style={{ marginLeft: 6 }}>{rightIcon}</View> : null}
    </TouchableOpacity>
  );
};

function getColors(theme: ReturnType<typeof useTheme>, variant: ButtonVariant, scheme: ColorScheme) {
  const palette = {
    primary: { bg: theme.colors.buttonBg, text: theme.colors.buttonText, border: theme.colors.buttonBg },
    teal: { bg: '#20B2AA', text: '#FFFFFF', border: '#20B2AA' },
    danger: { bg: '#DC2626', text: '#FFFFFF', border: '#DC2626' },
    neutral: { bg: '#6B7280', text: '#FFFFFF', border: '#6B7280' },
  }[scheme];

  if (variant === 'solid') {
    return { bgColor: palette.bg, textColor: palette.text, borderColor: palette.border };
  }
  if (variant === 'outline') {
    return { bgColor: 'transparent', textColor: palette.bg, borderColor: palette.border };
  }
  // ghost
  return { bgColor: 'transparent', textColor: palette.bg, borderColor: 'transparent' };
}

function getSizing(size: ButtonSize) {
  switch (size) {
    case 'sm':
      return { paddingV: 8, paddingH: 12, borderRadius: 8, fontSize: 14 };
    case 'lg':
      return { paddingV: 16, paddingH: 20, borderRadius: 12, fontSize: 18 };
    case 'md':
    default:
      return { paddingV: 12, paddingH: 16, borderRadius: 10, fontSize: 16 };
  }
}

export { Button };


