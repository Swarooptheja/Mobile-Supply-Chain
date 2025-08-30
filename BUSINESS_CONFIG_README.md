# Business Configuration System

## Overview

The Business Configuration system centralizes all business logic configuration values in one place, making it easy to modify settings without changing code logic in multiple locations.

## Location

All business configuration is located in `src/config/business.ts` and exported through `src/config/index.ts`.

## Structure

### 1. Pagination Configuration
```typescript
PAGINATION: {
  ORGANIZATION_PAGE_SIZE: 30,
  ORGANIZATION_SEARCH_DEBOUNCE_MS: 500,
  LOAD_TO_DOCK_PAGE_SIZE: 20,
  LOAD_TO_DOCK_SEARCH_DEBOUNCE_MS: 300,
  DEFAULT_PAGE_SIZE: 25,
  DEFAULT_SEARCH_DEBOUNCE_MS: 500,
}
```

### 2. FlatList Performance Configuration
```typescript
FLATLIST: {
  ORGANIZATION: {
    INITIAL_NUM_TO_RENDER: 20,
    MAX_TO_RENDER_PER_BATCH: 30,
    WINDOW_SIZE: 11,
    ON_END_REACHED_THRESHOLD: 0.4,
  },
  LOAD_TO_DOCK: {
    INITIAL_NUM_TO_RENDER: 15,
    MAX_TO_RENDER_PER_BATCH: 20,
    WINDOW_SIZE: 10,
    ON_END_REACHED_THRESHOLD: 0.3,
  },
  DEFAULT: {
    INITIAL_NUM_TO_RENDER: 20,
    MAX_TO_RENDER_PER_BATCH: 25,
    WINDOW_SIZE: 10,
    ON_END_REACHED_THRESHOLD: 0.4,
  },
}
```

### 3. Search Configuration
```typescript
SEARCH: {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  DEFAULT_DEBOUNCE_MS: 500,
}
```

### 4. Refresh Configuration
```typescript
REFRESH: {
  SUCCESS_MESSAGE_DURATION: 3000,
  ERROR_MESSAGE_DURATION: 5000,
  PULL_TO_REFRESH_THRESHOLD: 50,
}
```

### 5. UI Configuration
```typescript
UI: {
  ANIMATION_DURATION: 300,
  TOUCH_OPACITY: 0.7,
  BORDER_RADIUS: 8,
  SHADOW_OFFSET: { width: 0, height: 2 },
  SHADOW_OPACITY: 0.25,
  SHADOW_RADIUS: 3.84,
}
```

## Usage

### Import Configuration
```typescript
import { BUSINESS_CONFIG } from '../config';
```

### Use in Components
```typescript
// Pagination
const { organizations } = useOrganizations({
  pageSize: BUSINESS_CONFIG.PAGINATION.ORGANIZATION_PAGE_SIZE,
  searchDebounceMs: BUSINESS_CONFIG.PAGINATION.ORGANIZATION_SEARCH_DEBOUNCE_MS,
});

// FlatList Performance
<FlatList
  initialNumToRender={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.INITIAL_NUM_TO_RENDER}
  maxToRenderPerBatch={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.MAX_TO_RENDER_PER_BATCH}
  windowSize={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.WINDOW_SIZE}
  onEndReachedThreshold={BUSINESS_CONFIG.FLATLIST.ORGANIZATION.ON_END_REACHED_THRESHOLD}
/>
```

### Helper Functions
```typescript
import { getPaginationConfig, getFlatListConfig } from '../config';

// Get pagination config for specific screen
const pageSize = getPaginationConfig('ORGANIZATION_PAGE_SIZE');

// Get FlatList config for specific screen
const flatListConfig = getFlatListConfig('ORGANIZATION');
```

## Benefits

1. **Centralized Configuration**: All business settings in one place
2. **Easy Maintenance**: Modify values without touching component code
3. **Consistency**: Ensures consistent values across the app
4. **Performance Tuning**: Easy to adjust FlatList performance settings
5. **Environment-Specific**: Can be extended for different environments

## Adding New Configuration

### 1. Add to BUSINESS_CONFIG Object
```typescript
export const BUSINESS_CONFIG = {
  // ... existing config
  NEW_SECTION: {
    NEW_VALUE: 'default',
    ANOTHER_VALUE: 100,
  },
} as const;
```

### 2. Add Helper Function (Optional)
```typescript
export const getNewSectionConfig = () => {
  return BUSINESS_CONFIG.NEW_SECTION;
};
```

### 3. Use in Components
```typescript
import { BUSINESS_CONFIG } from '../config';

const value = BUSINESS_CONFIG.NEW_SECTION.NEW_VALUE;
```

## Migration Guide

### Before (Hardcoded Values)
```typescript
const { organizations } = useOrganizations({
  pageSize: 30,
  searchDebounceMs: 500,
});
```

### After (Using BusinessConfig)
```typescript
import { BUSINESS_CONFIG } from '../config';

const { organizations } = useOrganizations({
  pageSize: BUSINESS_CONFIG.PAGINATION.ORGANIZATION_PAGE_SIZE,
  searchDebounceMs: BUSINESS_CONFIG.PAGINATION.ORGANIZATION_SEARCH_DEBOUNCE_MS,
});
```

## Best Practices

1. **Never hardcode business values** - Always use BusinessConfig
2. **Use descriptive names** - Make configuration keys self-explanatory
3. **Group related settings** - Organize configuration logically
4. **Provide defaults** - Always have fallback values
5. **Document changes** - Update this README when adding new config

## Performance Considerations

- FlatList performance settings can significantly impact app performance
- Test different values for `initialNumToRender`, `maxToRenderPerBatch`, and `windowSize`
- Monitor memory usage and scrolling performance when adjusting these values
- Consider device capabilities when setting performance thresholds
