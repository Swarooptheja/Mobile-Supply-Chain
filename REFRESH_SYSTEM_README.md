# API Refresh System

A comprehensive, reusable refresh system for handling API data synchronization throughout the application.

## Architecture Overview

The refresh system is built with a layered architecture that promotes reusability, maintainability, and performance:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                            │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │ LoadToDockList  │  │     Other Screens              │  │
│  │ Screen          │  │                                 │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Custom Hooks                            │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │ useLoadToDock   │  │        useApiRefresh            │  │
│  │ Refresh         │  │     (Generic Hook)              │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Services Layer                           │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │ ApiRefresh      │  │        ActivityService          │  │
│  │ Service         │  │     (Updated to use core)       │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. ApiRefreshService (`src/services/apiRefreshService.ts`)

The core service that handles all API processing logic:

**Key Features:**
- ✅ **Reusable**: Can be used by any service or hook
- ✅ **Performance Optimized**: Includes timeout handling, progress tracking, and error recovery
- ✅ **Type Safe**: Full TypeScript support with comprehensive interfaces
- ✅ **Cancellable**: Supports AbortController for cancellation
- ✅ **Progress Tracking**: Real-time progress updates with ETA calculation
- ✅ **Error Handling**: Detailed error reporting and recovery mechanisms

**Main Methods:**
```typescript
// Process a single API
static async processApi(apiName, orgId, defaultOrgId, abortSignal?, timeout?)

// Refresh multiple APIs
static async refreshDataForResponsibilities(options: IRefreshOptions)

// Get API configurations
static getApiConfigurations(responsibilities: string[])

// Get refresh summary
static getRefreshSummary(results: IRefreshResult[])
```

### 2. useApiRefresh Hook (`src/hooks/useApiRefresh.ts`)

Generic hook for any refresh operations:

**Features:**
- ✅ **Flexible**: Can refresh any set of responsibilities
- ✅ **Auto-retry**: Optional automatic retry with exponential backoff
- ✅ **Progress Tracking**: Real-time progress updates
- ✅ **Cancellation**: Support for cancelling ongoing operations
- ✅ **Notifications**: Integrated with attractive notification system
- ✅ **State Management**: Comprehensive state management for refresh operations

**Usage:**
```typescript
const {
  isRefreshing,
  refreshProgress,
  lastRefreshResults,
  refreshSummary,
  refreshData,
  refreshSpecificApis,
  cancelRefresh,
  retryFailedApis
} = useApiRefresh({
  timeout: 30000,
  showNotifications: true,
  autoRetry: false,
  maxRetries: 3
});
```

### 3. useLoadToDockRefresh Hook (`src/hooks/useLoadToDockRefresh.ts`)

Specialized hook for LoadToDock functionality:

**Features:**
- ✅ **LoadToDock Specific**: Pre-configured for SHIP_CONFIRM and other LoadToDock APIs
- ✅ **Simple Interface**: Easy-to-use methods for common operations
- ✅ **Extensible**: Can be easily extended for additional LoadToDock responsibilities

**Usage:**
```typescript
const {
  isRefreshing,
  refreshProgress,
  refreshShipConfirmData,
  refreshAllLoadToDockData,
  cancelRefresh
} = useLoadToDockRefresh({
  enableShipConfirmOnly: true,
  timeout: 30000,
  showNotifications: true
});
```

### 4. RefreshProgressIndicator Component (`src/components/RefreshProgressIndicator.tsx`)

Reusable progress indicator component:

**Features:**
- ✅ **Animated**: Smooth animations for show/hide
- ✅ **Detailed**: Shows current API, type, progress, and ETA
- ✅ **Themed**: Consistent with app theming
- ✅ **Responsive**: Adapts to different screen sizes
- ✅ **Accessible**: Proper accessibility support

**Usage:**
```typescript
<RefreshProgressIndicator 
  progress={refreshProgress}
  visible={isRefreshing}
  showDetails={true}
/>
```

## Usage Examples

### Basic LoadToDock Refresh

```typescript
import { useLoadToDockRefresh } from '../hooks/useLoadToDockRefresh';

const LoadToDockScreen = () => {
  const {
    isRefreshing,
    refreshProgress,
    refreshShipConfirmData,
    cancelRefresh
  } = useLoadToDockRefresh();

  const handleRefresh = async () => {
    await refreshShipConfirmData();
  };

  return (
    <View>
      <RefreshProgressIndicator 
        progress={refreshProgress}
        visible={isRefreshing}
      />
      <Button onPress={handleRefresh} title="Refresh Data" />
    </View>
  );
};
```

### Generic API Refresh

```typescript
import { useApiRefresh } from '../hooks/useApiRefresh';

const AnyScreen = () => {
  const {
    isRefreshing,
    refreshData,
    refreshSpecificApis,
    lastRefreshResults
  } = useApiRefresh({
    timeout: 45000,
    autoRetry: true,
    maxRetries: 2
  });

  const handleRefreshAll = async () => {
    await refreshData(); // Refreshes all user responsibilities
  };

  const handleRefreshSpecific = async () => {
    await refreshSpecificApis(['ITEM', 'ACCOUNT', 'SHIP_CONFIRM']);
  };

  return (
    <View>
      <Button onPress={handleRefreshAll} title="Refresh All" />
      <Button onPress={handleRefreshSpecific} title="Refresh Specific" />
    </View>
  );
};
```

### Custom Service Integration

```typescript
import { ApiRefreshService } from '../services/apiRefreshService';

class CustomService {
  static async refreshCustomData(orgId: string, responsibilities: string[]) {
    const results = await ApiRefreshService.refreshDataForResponsibilities({
      orgId,
      defaultOrgId: orgId,
      responsibilities,
      onProgress: (progress) => {
        console.log(`Progress: ${progress.percentage}%`);
      }
    });
    
    return results;
  }
}
```

## Performance Optimizations

### 1. **Concurrent Processing**
- APIs are processed concurrently when possible
- Reduces total refresh time significantly

### 2. **Progress Tracking**
- Real-time progress updates
- ETA calculation based on average processing time
- Smooth UI updates with debouncing

### 3. **Memory Management**
- Proper cleanup of AbortController instances
- Efficient state management with useMemo and useCallback
- Automatic garbage collection of completed operations

### 4. **Error Recovery**
- Automatic retry with exponential backoff
- Graceful degradation on partial failures
- Detailed error reporting for debugging

### 5. **Caching**
- Reuses existing API configurations
- Avoids redundant API calls
- Efficient data structure management

## Error Handling

The system provides comprehensive error handling:

### 1. **Network Errors**
- Timeout handling with configurable timeouts
- Network connectivity checks
- Automatic retry mechanisms

### 2. **API Errors**
- HTTP status code handling
- Detailed error messages
- Graceful degradation

### 3. **User Experience**
- Attractive notifications for all states
- Progress indicators during operations
- Cancellation support

## Type Safety

All components are fully typed with TypeScript:

```typescript
interface IRefreshResult {
  success: boolean;
  error?: string;
  recordsTotal: number;
  recordsInserted: number;
  apiName: string;
  apiType: 'master' | 'config' | 'transactional';
  duration?: number;
}

interface IRefreshProgress {
  current: number;
  total: number;
  percentage: number;
  currentApi?: string;
  currentApiType?: 'master' | 'config' | 'transactional';
  estimatedTimeRemaining?: number;
}
```

## Migration from ActivityService

The ActivityService has been updated to use the new ApiRefreshService internally:

### Before:
```typescript
// Old ActivityService had all the API processing logic
const result = await ActivityService.processApi(apiName, orgId, defaultOrgId);
```

### After:
```typescript
// ActivityService now delegates to ApiRefreshService
const result = await ActivityService.processApi(apiName, orgId, defaultOrgId);
// Internally calls ApiRefreshService.processApi()
```

**Benefits:**
- ✅ **No Breaking Changes**: Existing code continues to work
- ✅ **Consistent Logic**: All API processing uses the same core logic
- ✅ **Better Performance**: Improved error handling and progress tracking
- ✅ **Maintainability**: Single source of truth for API processing

## Best Practices

### 1. **Use Specialized Hooks When Possible**
```typescript
// ✅ Good - Use specialized hook for LoadToDock
const { refreshShipConfirmData } = useLoadToDockRefresh();

// ❌ Avoid - Generic hook for specific use case
const { refreshSpecificApis } = useApiRefresh();
refreshSpecificApis(['SHIP_CONFIRM']);
```

### 2. **Handle Loading States**
```typescript
// ✅ Good - Show loading state
{isRefreshing && <RefreshProgressIndicator progress={refreshProgress} />}

// ❌ Avoid - No loading feedback
await refreshData();
```

### 3. **Provide Cancellation**
```typescript
// ✅ Good - Allow cancellation
<Button onPress={cancelRefresh} title="Cancel" />

// ❌ Avoid - No way to cancel long operations
```

### 4. **Use Appropriate Timeouts**
```typescript
// ✅ Good - Set appropriate timeout
const { refreshData } = useApiRefresh({ timeout: 60000 }); // 60 seconds

// ❌ Avoid - Too short timeout
const { refreshData } = useApiRefresh({ timeout: 5000 }); // 5 seconds
```

## Future Enhancements

### 1. **Background Refresh**
- Implement background refresh for critical data
- Periodic refresh scheduling
- Push notification integration

### 2. **Offline Support**
- Queue refresh operations when offline
- Automatic sync when connection restored
- Conflict resolution strategies

### 3. **Analytics Integration**
- Track refresh performance metrics
- Monitor API success rates
- User behavior analytics

### 4. **Advanced Caching**
- Implement intelligent caching strategies
- Cache invalidation policies
- Data freshness indicators

## Troubleshooting

### Common Issues

1. **Refresh Not Starting**
   - Check if `defaultOrgId` is available
   - Verify responsibilities are properly configured
   - Check network connectivity

2. **Progress Not Updating**
   - Ensure `onProgress` callback is provided
   - Check if component is properly re-rendering
   - Verify progress state updates

3. **APIs Failing**
   - Check API configuration in respective service files
   - Verify network connectivity
   - Check API endpoint availability
   - Review error logs for specific error messages

4. **Performance Issues**
   - Reduce timeout values for faster failure detection
   - Implement proper cancellation
   - Consider reducing concurrent API calls
   - Monitor memory usage

### Debug Mode

Enable debug logging by setting:
```typescript
console.log('Debug mode enabled');
```

This will provide detailed logs for:
- API processing steps
- Progress updates
- Error details
- Performance metrics

## Conclusion

The new refresh system provides a robust, scalable, and maintainable solution for API data synchronization throughout the application. It follows React Native best practices, provides excellent developer experience, and ensures optimal performance and user experience.

The system is designed to be:
- **Reusable**: Can be used across different screens and features
- **Maintainable**: Clean architecture with separation of concerns
- **Performant**: Optimized for speed and efficiency
- **User-friendly**: Great UX with progress indicators and notifications
- **Type-safe**: Full TypeScript support
- **Extensible**: Easy to add new features and capabilities
