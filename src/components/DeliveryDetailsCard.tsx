import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { createDeliveryDetailsCardStyles } from '../styles/DeliveryDetailsCard.styles';

interface DeliveryDetailsCardProps {
  salesOrderNumber: string;
  customerName: string;
  itemCount: number;
  date: string;
}

export const DeliveryDetailsCard: React.FC<DeliveryDetailsCardProps> = ({
  salesOrderNumber,
  customerName,
  itemCount,
  date
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createDeliveryDetailsCardStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftDetails}>
          <Text style={styles.salesOrderNumber}>SO# {salesOrderNumber}</Text>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.totalItems}>{t('loadToDock.itemsToLoad')}: {itemCount}</Text>
        </View>
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>{t('ui.date')}</Text>
          <Text style={styles.dateValue}>{date}</Text>
        </View>
      </View>
    </View>
  );
};
