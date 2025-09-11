import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { createEmptyStateStyles } from '../../styles/ActivityScreen.styles';
import { useTranslation } from '../../hooks/useTranslation';

export const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  const styles = createEmptyStateStyles();
  
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconContainer}>
        <VectorIcon
          name="cloud-sync"
          iconSet="MaterialIcons"
          size={48}
          color="#94A3B8"
        />
      </View>
      <Text style={styles.emptyStateTitle}>{t('activity.noApisToProcess')}</Text>
      <Text style={styles.emptyStateMessage}>
        {t('activity.noApisFoundMessage')}
      </Text>
      <View style={styles.emptyStateTip}>
        <VectorIcon
          name="info"
          iconSet="MaterialIcons"
          size={14}
          color="#94A3B8"
        />
        <Text style={styles.tipText}>
          {t('activity.responsibilitiesTip')}
        </Text>
      </View>
    </View>
  );
};
