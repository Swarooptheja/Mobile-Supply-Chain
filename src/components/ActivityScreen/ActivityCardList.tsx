import React from 'react';
import { View } from 'react-native';
import { ActivityCard } from './ActivityCard';
import { EmptyState } from './EmptyState';
import type { ConsolidatedApiRecord } from '../../hooks/useActivityConsolidation';

interface ActivityCardListProps {
  records: ConsolidatedApiRecord[];
  cardRefs: React.MutableRefObject<{ [key: string]: View | null }>;
  isExpanded: (id: string) => boolean;
  onToggleExpansion: (id: string) => void;
  onRetry: (record: ConsolidatedApiRecord) => void;
  isRetrying: (id: string) => boolean;
}

/**
 * Component to render the list of activity cards
 * This component reduces inline JSX complexity in the main screen
 * and makes the card rendering logic more maintainable
 */
export const ActivityCardList: React.FC<ActivityCardListProps> = ({
  records,
  cardRefs,
  isExpanded,
  onToggleExpansion,
  onRetry,
  isRetrying,
}) => {
  // Show empty state if no records
  if (records.length === 0) {
    return <EmptyState />;
  }

  // Render activity cards
  return (
    <>
      {records.map((record) => (
        <View
          key={record.id}
          ref={(el) => {
            if (el) {
              cardRefs.current[record.id] = el as any;
            }
          }}
        >
          <ActivityCard
            record={record}
            isExpanded={isExpanded(record.id)}
            onToggleExpansion={onToggleExpansion}
            onRetry={onRetry}
            isRetrying={isRetrying(record.id)}
          />
        </View>
      ))}
    </>
  );
};
