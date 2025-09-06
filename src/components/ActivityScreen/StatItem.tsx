import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { IconSet } from '../../interfaces/VectorIcon.interface';

interface IStatItemProps {
  icon: {
    name: string;
    iconSet: IconSet;
    color: string;
  };
  value: string | number;
  label: string;
  containerStyle?: ViewStyle;
  valueStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const StatItem: React.FC<IStatItemProps> = ({ 
  icon, 
  value, 
  label, 
  containerStyle,
  valueStyle,
  labelStyle
}) => {
  return (
    <View style={[styles.statItem, containerStyle]}>
      <View style={styles.statIconContainer}>
        <VectorIcon
          name={icon.name}
          iconSet={icon.iconSet}
          size={20}
          color={icon.color}
        />
      </View>
      <Text style={[styles.statValue, valueStyle]}>{value}</Text>
      <Text style={[styles.statLabel, labelStyle]}>{label}</Text>
    </View>
  );
};

const styles = {
  statItem: {
    alignItems: 'center' as const,
    flex: 1,
    paddingVertical: 12,
  },
  statIconContainer: {
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900' as const,
    marginBottom: 0,
    letterSpacing: 0.3,
    textAlign: 'center' as const,
  },
  statLabel: {
    fontSize: 7,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
  },
};

export { StatItem };
