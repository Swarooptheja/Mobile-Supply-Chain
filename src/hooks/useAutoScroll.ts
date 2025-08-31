import { useRef, useEffect, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { ACTIVITY_CONSTANTS } from '../constants/activityConstants';

/**
 * Custom hook to handle auto-scrolling to specific cards
 * This consolidates the auto-scroll logic that was duplicated in the main component
 * 
 * @returns Object with scroll refs and scroll function
 */
export const useAutoScroll = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const cardRefs = useRef<{ [key: string]: View | null }>({});
  const lastScrolledCard = useRef<string | null>(null);

  /**
   * Scroll to a specific card by ID
   * @param cardId - The ID of the card to scroll to
   * @param animated - Whether to animate the scroll
   */
  const scrollToCard = useCallback((cardId: string, animated: boolean = true) => {
    const cardRef = cardRefs.current[cardId];
    if (cardRef && scrollViewRef.current) {
      cardRef.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - ACTIVITY_CONSTANTS.SCROLL_OFFSET),
            animated
          });
        },
        () => {
          console.warn('Failed to measure card layout');
        }
      );
    }
  }, []);

  /**
   * Auto-scroll to processing or completed cards
   * @param records - Array of consolidated API records
   * @param isProcessing - Whether any API is currently processing
   */
  const handleAutoScroll = useCallback((records: any[], isProcessing: boolean) => {
    if (records.length === 0) return;

    let cardToScrollTo: string | null = null;

    // Priority 1: Scroll to processing cards
    if (isProcessing) {
      const processingCard = records.find(record => record.status === 'processing');
      if (processingCard && processingCard.id !== lastScrolledCard.current) {
        cardToScrollTo = processingCard.id;
      }
    }

    // Priority 2: Scroll to recently completed cards
    if (!cardToScrollTo) {
      const completedCards = records.filter(record => record.status === 'success');
      if (completedCards.length > 0) {
        const lastCompletedCard = completedCards[completedCards.length - 1];
        if (lastCompletedCard.id !== lastScrolledCard.current) {
          cardToScrollTo = lastCompletedCard.id;
        }
      }
    }

    // Perform the scroll if we found a card
    if (cardToScrollTo) {
      lastScrolledCard.current = cardToScrollTo;
      const delay = isProcessing ? ACTIVITY_CONSTANTS.SCROLL_DELAY : ACTIVITY_CONSTANTS.SCROLL_DELAY + 200;
      
      setTimeout(() => {
        scrollToCard(cardToScrollTo!);
      }, delay);
    }
  }, [scrollToCard]);

  return {
    scrollViewRef,
    cardRefs,
    scrollToCard,
    handleAutoScroll,
  };
};
