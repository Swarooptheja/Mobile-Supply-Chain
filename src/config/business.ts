// Business Configuration
// This file contains business logic configuration values that can be easily modified
// without changing the code logic in multiple places.

export const BUSINESS_CONFIG = {
  // Pagination Configuration
  PAGINATION: {
    // Organization Screen
    ORGANIZATION_PAGE_SIZE: 30,
    ORGANIZATION_SEARCH_DEBOUNCE_MS: 500,
    
    // Load to Dock Screen
    LOAD_TO_DOCK_PAGE_SIZE: 20,
    LOAD_TO_DOCK_SEARCH_DEBOUNCE_MS: 300,
    
    // Default page sizes for other screens
    DEFAULT_PAGE_SIZE: 25,
    DEFAULT_SEARCH_DEBOUNCE_MS: 500,
  },

  // FlatList Performance Configuration
  FLATLIST: {
    // Organization Screen
    ORGANIZATION: {
      INITIAL_NUM_TO_RENDER: 20,
      MAX_TO_RENDER_PER_BATCH: 30,
      WINDOW_SIZE: 11,
      ON_END_REACHED_THRESHOLD: 0.4,
    },
    
    // Load to Dock Screen
    LOAD_TO_DOCK: {
      INITIAL_NUM_TO_RENDER: 15,
      MAX_TO_RENDER_PER_BATCH: 20,
      WINDOW_SIZE: 10,
      ON_END_REACHED_THRESHOLD: 0.3,
    },
    
    // Default values for other screens
    DEFAULT: {
      INITIAL_NUM_TO_RENDER: 20,
      MAX_TO_RENDER_PER_BATCH: 25,
      WINDOW_SIZE: 10,
      ON_END_REACHED_THRESHOLD: 0.4,
    },
  },

  // Search Configuration
  SEARCH: {
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    DEFAULT_DEBOUNCE_MS: 500,
  },

  // Refresh Configuration
  REFRESH: {
    SUCCESS_MESSAGE_DURATION: 3000,
    ERROR_MESSAGE_DURATION: 5000,
    PULL_TO_REFRESH_THRESHOLD: 50,
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    TOUCH_OPACITY: 0.7,
    BORDER_RADIUS: 8,
    SHADOW_OFFSET: { width: 0, height: 2 },
    SHADOW_OPACITY: 0.25,
    SHADOW_RADIUS: 3.84,
  },
} as const;

// Helper functions for accessing configuration
export const getPaginationConfig = (screen: keyof typeof BUSINESS_CONFIG.PAGINATION) => {
  return BUSINESS_CONFIG.PAGINATION[screen] || BUSINESS_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
};

export const getFlatListConfig = (screen: keyof typeof BUSINESS_CONFIG.FLATLIST) => {
  return BUSINESS_CONFIG.FLATLIST[screen] || BUSINESS_CONFIG.FLATLIST.DEFAULT;
};

export const getSearchConfig = () => {
  return BUSINESS_CONFIG.SEARCH;
};

export const getRefreshConfig = () => {
  return BUSINESS_CONFIG.REFRESH;
};

export const getUIConfig = () => {
  return BUSINESS_CONFIG.UI;
};
