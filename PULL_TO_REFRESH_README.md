# Pull-to-Refresh Component Usage Guide

This document explains how to use the reusable pull-to-refresh components that have been implemented for the application.

## Components Overview

### 1. PullToRefreshWrapper
A wrapper component that provides refresh functionality and visual indicators.

### 2. PullToRefreshFlatList
An enhanced FlatList component with built-in pull-to-refresh functionality.

### 3. useRefreshData Hook
A custom hook for managing refresh state and operations.

## Basic Usage

### Using PullToRefreshFlatList (Recommended)

```tsx
import { PullToRefreshFlatList } from '../components/PullToRefreshWrapper';
import { useRefreshData } from '../hooks';

const MyScreen: React.FC = () => {
  const { refreshData, refreshing } = useRefreshData({
    successMessage: 'Data refreshed successfully',
    errorMessage: 'Failed to refresh data',
  });

  const handleRefresh = async () => {
    // Your API call logic here
    await refreshData(async () => {
      // Call your API
      await fetchDataFromAPI();
      // Update local database if needed
      await updateLocalDatabase();
    });
    
    // Reload local data
    loadLocalData();
  };

  return (
    <PullToRefreshFlatList
      data={myData}
      renderItem={renderItem}
      refreshConfig={{
        onRefresh: handleRefresh,
        successMessage: 'Data refreshed successfully',
        errorMessage: 'Failed to refresh data',
      }}
      showRefreshIndicator={true}
      refreshIndicatorText="Refreshing data from server..."
      // ... other FlatList props
    />
  );
};
```

### Using PullToRefreshWrapper

```tsx
import PullToRefreshWrapper from '../components/PullToRefreshWrapper';

const MyScreen: React.FC = () => {
  const handleRefresh = async () => {
    // Your refresh logic here
  };

  return (
    <PullToRefreshWrapper
      refreshConfig={{
        onRefresh: handleRefresh,
        successMessage: 'Data refreshed successfully',
      }}
      showRefreshIndicator={true}
      refreshIndicatorText="Refreshing..."
    >
      {/* Your content here */}
      <ScrollView>
        {/* ... */}
      </ScrollView>
    </PullToRefreshWrapper>
  );
};
```

## Specialized Hooks

### useOrganizationRefresh
Pre-configured hook for organization data refresh:

```tsx
import { useOrganizationRefresh } from '../hooks';

const OrganizationScreen: React.FC = () => {
  const { refreshData, refreshing } = useOrganizationRefresh();
  
  const handleRefresh = async () => {
    await refreshData(refreshOrganizationsFromAPI);
    resetAndLoad();
  };
  
  // ... rest of component
};
```

### useDashboardRefresh
Pre-configured hook for dashboard data refresh:

```tsx
import { useDashboardRefresh } from '../hooks';

const DashboardScreen: React.FC = () => {
  const { refreshData, refreshing } = useDashboardRefresh();
  
  const handleRefresh = async () => {
    await refreshData(refreshDashboardData);
    loadDashboardData();
  };
  
  // ... rest of component
};
```

## Custom Refresh Configuration

You can customize the refresh behavior:

```tsx
const { refreshData, refreshing } = useRefreshData({
  successMessage: 'Custom success message',
  errorMessage: 'Custom error message',
  showToast: true, // Enable/disable toast notifications
  onSuccess: () => {
    // Custom success callback
    console.log('Refresh completed successfully');
  },
  onError: (error) => {
    // Custom error callback
    console.error('Refresh failed:', error);
  },
});
```

## Integration with Toast System

The refresh hooks automatically integrate with your toast system:

- Success messages are shown automatically
- Error messages are displayed with proper error handling
- You can disable toast notifications if needed

## Best Practices

1. **Use PullToRefreshFlatList** for lists that need refresh functionality
2. **Use specialized hooks** (useOrganizationRefresh, useDashboardRefresh) for common use cases
3. **Always handle errors gracefully** - the hooks provide built-in error handling
4. **Show loading states** - the refreshing state is automatically managed
5. **Provide meaningful feedback** - customize success/error messages for better UX

## Example: Dashboard Implementation

```tsx
import { PullToRefreshFlatList } from '../components/PullToRefreshWrapper';
import { useDashboardRefresh } from '../hooks';

const DashboardScreen: React.FC = () => {
  const { refreshData, refreshing } = useDashboardRefresh();
  
  const handleRefresh = async () => {
    await refreshData(async () => {
      // Refresh multiple data sources
      await Promise.all([
        refreshUserData(),
        refreshNotifications(),
        refreshRecentActivity()
      ]);
    });
    
    // Reload all dashboard data
    loadDashboardData();
  };

  return (
    <PullToRefreshFlatList
      data={dashboardItems}
      renderItem={renderDashboardItem}
      refreshConfig={{
        onRefresh: handleRefresh,
        successMessage: 'Dashboard updated successfully',
        errorMessage: 'Failed to update dashboard',
      }}
      showRefreshIndicator={true}
      refreshIndicatorText="Updating dashboard..."
      // ... other props
    />
  );
};
```

## Migration from Old Implementation

If you're migrating from the old refresh implementation:

1. Replace `FlatList` with `PullToRefreshFlatList`
2. Replace manual refresh state with `useRefreshData` hook
3. Remove manual `onRefresh` and `refreshing` props
4. Use `refreshConfig` instead of separate refresh handlers

This new implementation provides better error handling, consistent UI, and reusable components across your application.
