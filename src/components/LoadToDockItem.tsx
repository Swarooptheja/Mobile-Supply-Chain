import React, { memo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions
} from 'react-native';
import { ILoadToDockItem } from '../types/loadToDock.interface';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { createLoadToDockItemStyles } from '../styles/LoadToDockItem.styles';

interface LoadToDockItemProps {
  item: ILoadToDockItem;
  index: number;
  onPress: (item: ILoadToDockItem) => void;
}

const LoadToDockItem: React.FC<LoadToDockItemProps> = memo(({ item, index: _index, onPress }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  
  const styles = createLoadToDockItemStyles(theme, isTablet, isDesktop);
  
  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity
      style={[
        styles.loadItemCard,
        item.status === 'in-progress' && styles.inProgressCard,
        item.status === 'completed' && styles.completedCard
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.deliveryIdContainer}>
          <Text style={styles.deliveryId}>{item.deliveryId}</Text>
        </View>
        <View style={styles.topRightContainer}>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>
              {item.itemCount || 0} {t('loadToDock.itemsToLoad')}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.label}>SO# {item.salesOrderNumber}</Text>
          <Text style={styles.value}>{item.customerName}</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={styles.dockValue}>{item.dock}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});


export default LoadToDockItem;
