import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';
import { ActivityCard } from './ActivityCard';
import { EmptyState } from './EmptyState';
import type { ConsolidatedApiRecord } from '../../hooks/useActivityConsolidation';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

// Animation constants
const STAGGER_DELAY = 150; // 150ms delay between cards
const ANIMATION_DURATION = 600; // Base animation duration
const EASING_TYPE = Easing.out(Easing.cubic); // Smooth easing

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
  // Animation refs for staggered card appearance
  const animationRefs = useRef<{ [key: string]: { translateX: Animated.Value; opacity: Animated.Value } }>({});
  const hasAnimated = useRef(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimating = useRef(false);
  const [visibleCards, setVisibleCards] = React.useState<string[]>([]);

  // Calculate initial position for each card based on index
  const getInitialPosition = (index: number) => {
    // First card starts at 50% of screen width, second at 40%, third at 30%, etc.
    const percentage = Math.max(10, 50 - (index * 10)); // Minimum 10% to prevent going off-screen
    return (screenWidth * percentage) / 100;
  };

  // Initialize animation values for each record
  useEffect(() => {
    records.forEach((record, index) => {
      if (record && record.id && !animationRefs.current[record.id]) {
        const initialPosition = getInitialPosition(index);
        animationRefs.current[record.id] = {
          translateX: new Animated.Value(initialPosition), // Start from calculated position
          opacity: new Animated.Value(0), // Start invisible
        };
      }
    });
  }, [records]);

  // Reset animation state when records change completely
  useEffect(() => {
    hasAnimated.current = false;
    isAnimating.current = false;
    setVisibleCards([]); // Clear visible cards when records change
  }, [records.length]);

  // Trigger staggered animations when records change
  useEffect(() => {
    if (records.length > 0 && !hasAnimated.current && !isAnimating.current) {
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Filter valid records first
      const validRecords = records.filter(record => record && record.id);
      
      // Ensure all animation objects are properly initialized before resetting
      validRecords.forEach((record, index) => {
        if (!animationRefs.current[record.id]) {
          const initialPosition = getInitialPosition(index);
          animationRefs.current[record.id] = {
            translateX: new Animated.Value(initialPosition),
            opacity: new Animated.Value(0),
          };
        }
      });
      
      // Reset all animation values to starting position
      validRecords.forEach((record, index) => {
        const animationObj = animationRefs.current[record.id];
        if (animationObj && animationObj.translateX && animationObj.opacity) {
          const initialPosition = getInitialPosition(index);
          animationObj.translateX.setValue(initialPosition);
          animationObj.opacity.setValue(0);
        }
      });
      
      // Start animations after a brief delay
      const startAnimations = () => {
        if (isAnimating.current) return; // Prevent multiple animations
        
        isAnimating.current = true;
        hasAnimated.current = true;
        
        // Animate each card sequentially with stagger delay
        const animateCardSequentially = (index: number) => {
          if (index >= validRecords.length) {
            isAnimating.current = false;
            return;
          }
          
          const record = validRecords[index];
          const animationObj = animationRefs.current[record.id];
          
          // Add card to visible cards before animation starts
          setVisibleCards(prev => [...prev, record.id]);
          
          if (animationObj && animationObj.translateX && animationObj.opacity) {
            // Use consistent animation duration and easing
            Animated.parallel([
              Animated.timing(animationObj.translateX, {
                toValue: 0, // Slide to final position
                duration: ANIMATION_DURATION,
                easing: EASING_TYPE,
                useNativeDriver: true,
              }),
              Animated.timing(animationObj.opacity, {
                toValue: 1, // Fade in
                duration: ANIMATION_DURATION,
                easing: EASING_TYPE,
                useNativeDriver: true,
              }),
            ]).start();
            
            // Start next card animation after stagger delay
            animationTimeoutRef.current = setTimeout(() => {
              animateCardSequentially(index + 1);
            }, STAGGER_DELAY);
          } else {
            // If animation object doesn't exist, skip to next card
            animationTimeoutRef.current = setTimeout(() => {
              animateCardSequentially(index + 1);
            }, STAGGER_DELAY);
          }
        };
        
        // Start the sequential animation
        animateCardSequentially(0);
      };
      
      // Start animations after a short delay to ensure proper initialization
      animationTimeoutRef.current = setTimeout(startAnimations, 100);
    }

    // Cleanup function
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [records]);

  // Show empty state if no records
  if (!records.length) {
    return <EmptyState />;
  }

  // Render activity cards with staggered animation - only render visible cards
  return (
    <>
      {records
        .filter(record => record && record.id && record.apiName && visibleCards.includes(record.id))
        .map((record, index) => {
          const animationObj = animationRefs.current[record.id];
          const fallbackPosition = getInitialPosition(index);
          
          // Ensure cards start invisible and positioned off-screen
          const initialOpacity = animationObj?.opacity || new Animated.Value(0);
          const initialTranslateX = animationObj?.translateX || new Animated.Value(fallbackPosition);
          
          return (
            <Animated.View
              key={record.id}
              style={{
                transform: [{ 
                  translateX: initialTranslateX
                }],
                opacity: initialOpacity,
              }}
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
            </Animated.View>
          );
        })}
    </>
  );
};
