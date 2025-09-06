import React, { memo } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createOrganizationScreenStyles } from '../styles/OrganizationScreen.styles';
import type { OrganizationListItem } from '../types/organization.interface';

interface OrganizationItemProps {
  item: OrganizationListItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

const OrganizationItem: React.FC<OrganizationItemProps> = memo(({ 
  item, 
  selected, 
  onSelect 
}) => {
  const theme = useTheme();
  const styles = createOrganizationScreenStyles(theme);
  
  // Defensive check for null/undefined item
  if (!item) {
    return null;
  }
  
  const id = String(item.InventoryOrgId ?? item.id ?? '');
  const name = item.InventoryOrgName || 'Unknown Organization';
  const code = item.InventoryOrgCode || id || 'N/A';

  const handlePress = () => onSelect(id);
  
  return (
    <TouchableOpacity 
      style={[styles.organizationCard, selected && styles.organizationCardSelected]}
      onPress={handlePress} 
      accessibilityRole="radio" 
      accessibilityState={{ selected }}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.radioContainer}>
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
              {selected ? <View style={styles.radioInner} /> : null}
            </View>
          </View>
          <View style={styles.organizationInfo}>
            <Text style={[styles.organizationName, selected && styles.organizationNameSelected]} numberOfLines={1}>
              {name || 'Unknown Organization'}
            </Text>
            <Text style={styles.organizationId} numberOfLines={1}>
              ID: {id || 'N/A'}
            </Text>
          </View>
        </View>
        <View style={[styles.codeBadge, selected && styles.codeBadgeSelected]}>
          <Text style={[styles.codeBadgeText, selected && styles.codeBadgeTextSelected]} numberOfLines={1}>
            {code || 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

OrganizationItem.displayName = 'OrganizationItem';

export default OrganizationItem;
