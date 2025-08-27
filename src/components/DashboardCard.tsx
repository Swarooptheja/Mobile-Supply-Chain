import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IDashboardCardProps } from '../types/dashboard.interface';

const DashboardCard: React.FC<IDashboardCardProps> = ({ 
  title, 
  content, 
  onPress 
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer 
      style={[styles.card, onPress && styles.pressableCard]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {title && (
        <Text style={styles.cardTitle}>{title}</Text>
      )}
      <View style={styles.cardContent}>
        {content}
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressableCard: {
    // Additional styles for pressable cards if needed
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  cardContent: {
    // Content styling
  },
});

export default DashboardCard;
