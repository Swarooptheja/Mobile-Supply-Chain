import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { IconComponent } from './icons';

interface MediaStatusChipProps {
  type: 'photos' | 'video';
  status: 'pending' | 'completed';
  onPress?: () => void;
  size?: 'small' | 'medium';
}

export const MediaStatusChip: React.FC<MediaStatusChipProps> = ({
  type,
  status,
  onPress,
  size = 'medium'
}) => {
  const theme = useTheme();
  
  const isCompleted = status === 'completed';
  const isPhotos = type === 'photos';
  
  const styles = createStyles(theme, size);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const getStatusText = () => {
    if (isPhotos) {
      return isCompleted ? 'Photos ✓' : 'Photos Pending';
    }
    return isCompleted ? 'Video ✓' : 'Video Pending';
  };

  const getStatusIcon = () => {
    if (isCompleted) {
      return '✓';
    }
    return '●';
  };

  const getTypeIcon = () => {
    if (isPhotos) {
      return 'camera';
    }
    return 'video';
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isCompleted ? styles.completedChip : styles.pendingChip
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <IconComponent
        name={getTypeIcon()}
        size={size === 'small' ? 12 : 14}
        color={isCompleted ? theme.colors.success : '#f59e0b'}
        style={styles.typeIcon}
      />
      <Text style={[
        styles.statusText,
        isCompleted ? styles.completedText : styles.pendingText
      ]}>
        {getStatusText()}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, size: 'small' | 'medium') => StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: size === 'small' ? 8 : 10,
    paddingVertical: size === 'small' ? 4 : 6,
    borderRadius: size === 'small' ? 12 : 16,
    gap: size === 'small' ? 4 : 6,
    borderWidth: 1,
  },
  pendingChip: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  completedChip: {
    backgroundColor: '#d1fae5',
    borderColor: theme.colors.success,
  },
  typeIcon: {
    marginRight: 2, // Small adjustment for icon spacing
  },
  statusText: {
    fontSize: size === 'small' ? 11 : 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  pendingText: {
    color: '#92400e',
  },
  completedText: {
    color: '#065f46',
  },
});
