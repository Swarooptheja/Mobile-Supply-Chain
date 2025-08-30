import { useCallback, useEffect, useReducer, useRef } from 'react';
import { fetchOrganizationsPaged } from '../services/organizationService';
import type { OrganizationListItem } from '../types/organization.interface';

// State interface
interface OrganizationState {
  organizations: OrganizationListItem[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  searchText: string;
  error: string | null;
}

// Action types
type OrganizationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORGANIZATIONS'; payload: OrganizationListItem[] }
  | { type: 'APPEND_ORGANIZATIONS'; payload: OrganizationListItem[] }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SEARCH_TEXT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: OrganizationState = {
  organizations: [],
  loading: false,
  hasMore: true,
  page: 0,
  searchText: '',
  error: null,
};

// Reducer function
function organizationReducer(state: OrganizationState, action: OrganizationAction): OrganizationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ORGANIZATIONS':
      return { ...state, organizations: action.payload, loading: false, error: null };
    case 'APPEND_ORGANIZATIONS':
      return { ...state, organizations: [...state.organizations, ...action.payload], loading: false, error: null };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SEARCH_TEXT':
      return { ...state, searchText: action.payload, page: 0, hasMore: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

// Hook configuration
interface UseOrganizationsConfig {
  pageSize?: number;
  searchDebounceMs?: number;
}

export const useOrganizations = (config: UseOrganizationsConfig = {}) => {
  const { pageSize = 30, searchDebounceMs = 500 } = config;
  
  const [state, dispatch] = useReducer(organizationReducer, initialState);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Load organizations from database
  const loadOrganizations = useCallback(async (
    searchQuery: string = '', 
    pageNum: number = 0, 
    append: boolean = false
  ) => {
    if (!mountedRef.current) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { rows } = await fetchOrganizationsPaged({ 
        page: pageNum, 
        limit: pageSize, 
        search: searchQuery.trim()
      });
      
      if (!mountedRef.current) return;
      
      if (append) {
        dispatch({ type: 'APPEND_ORGANIZATIONS', payload: rows });
      } else {
        dispatch({ type: 'SET_ORGANIZATIONS', payload: rows });
      }
      
      dispatch({ type: 'SET_PAGE', payload: pageNum });
      dispatch({ type: 'SET_HAS_MORE', payload: rows.length === pageSize });
      
    } catch (error) {
      if (!mountedRef.current) return;
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load organizations';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // Show empty state on error
      if (!append) {
        dispatch({ type: 'SET_ORGANIZATIONS', payload: [] });
        dispatch({ type: 'SET_HAS_MORE', payload: false });
      }
    }
  }, [pageSize]);

  // Handle search with debouncing
  const handleSearch = useCallback((searchText: string) => {
    dispatch({ type: 'SET_SEARCH_TEXT', payload: searchText });
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        loadOrganizations(searchText, 0, false);
      }
    }, searchDebounceMs);
  }, [loadOrganizations, searchDebounceMs]);

  // Load more data for infinite scrolling
  const loadMore = useCallback(() => {
    if (state.loading || !state.hasMore || state.searchText.trim()) {
      return; // Don't paginate during search or if already loading
    }
    
    loadOrganizations(state.searchText, state.page + 1, true);
  }, [state.loading, state.hasMore, state.searchText, state.page, loadOrganizations]);

  // Refresh data (called from pull-to-refresh)
  const refresh = useCallback(async (refreshFunction: () => Promise<void>) => {
    try {
      await refreshFunction();
      
      // Reset state and reload
      dispatch({ type: 'RESET_STATE' });
      await loadOrganizations('', 0, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Refresh failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [loadOrganizations]);

  // Initial load
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  return {
    // State
    organizations: state.organizations,
    loading: state.loading,
    hasMore: state.hasMore,
    page: state.page,
    searchText: state.searchText,
    error: state.error,
    
    // Actions
    handleSearch,
    loadMore,
    refresh,
    loadOrganizations,
  };
};
