import { useReducer, useCallback } from 'react';

interface ActivityScreenState {
  apiCallAttempts: Set<string>;
  expandedCards: Set<string>;
}

type Action = 
  | { type: 'ADD_API_ATTEMPT'; payload: string }
  | { type: 'REMOVE_API_ATTEMPT'; payload: string }
  | { type: 'TOGGLE_CARD_EXPANSION'; payload: string }
  | { type: 'CLEAR_API_ATTEMPTS' }
  | { type: 'CLEAR_EXPANDED_CARDS' };

const initialState: ActivityScreenState = {
  apiCallAttempts: new Set(),
  expandedCards: new Set(),
};

const reducer = (state: ActivityScreenState, action: Action): ActivityScreenState => {
  switch (action.type) {
    case 'ADD_API_ATTEMPT':
      return {
        ...state,
        apiCallAttempts: new Set([...state.apiCallAttempts, action.payload])
      };
    case 'REMOVE_API_ATTEMPT':
      const newAttempts = new Set(state.apiCallAttempts);
      newAttempts.delete(action.payload);
      return { ...state, apiCallAttempts: newAttempts };
    case 'TOGGLE_CARD_EXPANSION':
      const newExpanded = new Set(state.expandedCards);
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload);
      } else {
        newExpanded.add(action.payload);
      }
      return { ...state, expandedCards: newExpanded };
    case 'CLEAR_API_ATTEMPTS':
      return { ...state, apiCallAttempts: new Set() };
    case 'CLEAR_EXPANDED_CARDS':
      return { ...state, expandedCards: new Set() };
    default:
      return state;
  }
};

export const useActivityScreenState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const addApiAttempt = useCallback((apiId: string) => {
    dispatch({ type: 'ADD_API_ATTEMPT', payload: apiId });
  }, []);
  
  const removeApiAttempt = useCallback((apiId: string) => {
    dispatch({ type: 'REMOVE_API_ATTEMPT', payload: apiId });
  }, []);
  
  const toggleCardExpansion = useCallback((cardId: string) => {
    dispatch({ type: 'TOGGLE_CARD_EXPANSION', payload: cardId });
  }, []);
  
  const clearApiAttempts = useCallback(() => {
    dispatch({ type: 'CLEAR_API_ATTEMPTS' });
  }, []);
  
  const clearExpandedCards = useCallback(() => {
    dispatch({ type: 'CLEAR_EXPANDED_CARDS' });
  }, []);
  
  const isApiAttempting = useCallback((apiId: string): boolean => {
    return state.apiCallAttempts.has(apiId);
  }, [state.apiCallAttempts]);
  
  const isCardExpanded = useCallback((cardId: string): boolean => {
    return state.expandedCards.has(cardId);
  }, [state.expandedCards]);
  
  return {
    state,
    addApiAttempt,
    removeApiAttempt,
    toggleCardExpansion,
    clearApiAttempts,
    clearExpandedCards,
    isApiAttempting,
    isCardExpanded,
  };
};
