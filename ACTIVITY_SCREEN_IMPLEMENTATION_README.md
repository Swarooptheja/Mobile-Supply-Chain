# Activity Screen Implementation

## Overview

The Activity Screen has been completely rebuilt from scratch to provide a comprehensive data synchronization dashboard for mobile applications. This implementation handles all edge cases, ensures APIs are called only once, and provides robust retry functionality for failed APIs.

## Key Features

### 🎯 Single API Call Guarantee
- **Prevents Duplicate Calls**: Each API endpoint is called exactly once during the synchronization process
- **Tracking System**: Uses a `calledApis` Set to track which APIs have been processed
- **Reset on Restart**: Clears tracking when starting a new synchronization process

### 🔄 Comprehensive Retry System
- **Individual Retry**: Each failed API card has its own "Retry Sync" button
- **Bulk Retry**: "Retry All Failed APIs" button for multiple failures
- **Retry Limits**: Maximum of 3 retry attempts per API
- **Retry State Tracking**: Visual feedback during retry operations
- **Prevents Multiple Retries**: Disables retry buttons during active retry operations

### 📊 Real-Time Progress Monitoring
- **Overall Progress**: Percentage-based progress bar with statistics
- **Category Breakdown**: Separate tracking for Master, Config, and Transactional APIs
- **Individual API Status**: Real-time status updates for each API endpoint
- **Performance Metrics**: Records fetched, inserted, and failed counts

### 🚦 Dependency-Based Execution
- **Sequential Processing**: Master → Config → Transactional APIs
- **Critical Failure Handling**: Stops process if Master or Config APIs fail
- **Dashboard Access Control**: Blocks access until critical APIs succeed

## UI Layout

### Header Section
- **App Title**: Left-aligned "Data Synchronization"
- **Logout Button**: Top-right logout with process cancellation

### Content Section
- **Progress Overview**: Visual progress bar with completion statistics
- **Loading State**: Animated progress bar during synchronization
- **API Categories**: Summary cards for Master, Config, and Transactional APIs
- **Individual API Cards**: Expandable cards showing detailed status

### API Card Features
- **Success Cards**: Green checkmark (✅) - non-expandable
- **Error Cards**: Red X (❌) - expandable with retry button
- **Failure Cards**: Warning icon (⚠️) - expandable with retry button
- **Processing Cards**: Loading spinner (🔄) with progress bar

### Action Buttons
- **Retry All Failed**: Bulk retry for multiple failures
- **Cancel Process**: Stops ongoing synchronization
- **Proceed to Dashboard**: Available when critical APIs succeed
- **Utility Actions**: Clear errors, refresh status

## Business Logic

### API Categories & Dependencies

#### Master APIs (Critical)
- **Items**: `getItemsTable/{orgId}`
- **GL Accounts**: `getglaccounts/{defaultOrgId}`
- **Sub Inventories**: `getSubinventories/{orgId}/null/Y`
- **Locators**: `getLocatorsTable/{orgId}/""`

#### Config APIs (Critical)
- **Reasons**: `getreasons`
- **GL Periods**: `getGLPeriods/{defaultOrgId}`
- **Inventory Periods**: `getInventoryPeriods/{defaultOrgId}/{orgId}`

#### Transactional APIs (Non-Critical)
- **Shipping Orders**: `EBS/23B/getSalesOrdersForShippingTable/{orgId}`

### Execution Rules
1. **Master APIs must succeed** - Process stops on any failure
2. **Config APIs must succeed** - Process stops on any failure
3. **Transactional APIs can fail** - Process continues regardless
4. **Dashboard access blocked** until Master + Config APIs succeed

### API Response Handling

#### Table Type APIs
- **Format**: 2D array with headers in row 0
- **Primary Keys**: Headers with "_PK" suffix are processed
- **Data Rows**: All subsequent rows inserted as records

#### JSON APIs
- **Metadata Endpoints**: `/metadata` suffix for table structure
- **Data Processing**: Structured JSON data insertion

## Error Handling

### Network Failures
- **Timeout Handling**: 30-second timeout with user-friendly messages
- **Connection Issues**: Specific error messages for network problems
- **Retry Logic**: Automatic retry with exponential backoff

### Data Processing Errors
- **Invalid Responses**: Validation of API response formats
- **Insertion Failures**: Tracking of successful vs. failed record insertions
- **Partial Failures**: Handling when some records succeed and others fail

### User Experience
- **Clear Error Messages**: Descriptive error text in expandable cards
- **Retry Guidance**: Clear instructions for resolving issues
- **Progress Preservation**: Maintains completed work during retries

## Notification System

### Notification Center
- **Error Notifications**: Red-themed for API failures
- **Warning Notifications**: Yellow/orange for insertion issues
- **Success Suppression**: No success notifications to avoid clutter

### Required Information
- **Timestamp**: When the failure occurred
- **API Identifier**: Clear source identification
- **Error Reason**: Distinguishes API vs. insertion failures
- **Records Summary**: "X fetched / Y inserted / Z failed" format

## Technical Implementation

### State Management
- **React Hooks**: useState, useCallback, useMemo for performance
- **Refs**: AbortController for cancellation, tracking for API calls
- **Memoization**: Computed values cached for performance

### API Processing
- **AbortController**: Proper cancellation of ongoing requests
- **Timeout Handling**: Race conditions for request timeouts
- **Error Boundaries**: Comprehensive error catching and handling

### Performance Optimizations
- **Lazy Loading**: Components render only when needed
- **Memoized Calculations**: Expensive operations cached
- **Efficient Updates**: Minimal re-renders during status changes

## Usage Examples

### Starting Synchronization
```typescript
const { startActivityProcess } = useActivityManager();

// Start with organization and responsibilities
await startActivityProcess(orgId, responsibilities, defaultOrgId);
```

### Retrying Failed APIs
```typescript
const { retryFailedApis } = useActivityManager();

// Retry all failed APIs
await retryFailedApis();

// Retry specific API
await retryFailedApis([specificApiId]);
```

### Checking Dashboard Access
```typescript
const { canProceedToDashboard } = useActivityManager();

if (canProceedToDashboard) {
  navigation.navigate('Dashboard');
}
```

## Configuration

### Environment Variables
- **API Timeout**: Configurable via `API_TIMEOUT_MS`
- **Retry Attempts**: Configurable via `MAX_RETRY_ATTEMPTS`
- **Retry Delay**: Configurable via `RETRY_DELAY_MS`

### Theme Customization
- **Color Schemes**: Light/dark mode support
- **Responsive Design**: Tablet and small device layouts
- **Accessibility**: High contrast and readable fonts

## Testing

### Unit Tests
- **Hook Testing**: useActivityManager functionality
- **Service Testing**: ActivityService API processing
- **Component Testing**: UI component behavior

### Integration Tests
- **API Flow Testing**: Complete synchronization process
- **Error Handling**: Various failure scenarios
- **Retry Logic**: Retry mechanism validation

### Manual Testing
- **Network Conditions**: Poor connectivity scenarios
- **Large Datasets**: Performance with many APIs
- **User Interactions**: All button and gesture actions

## Troubleshooting

### Common Issues
1. **APIs Called Multiple Times**: Check `calledApis` tracking
2. **Retry Not Working**: Verify retry count limits
3. **Progress Not Updating**: Check state update functions
4. **Dashboard Access Blocked**: Verify Master/Config API success

### Debug Information
- **Console Logs**: Detailed API processing information
- **Error Tracking**: Comprehensive error logging
- **State Inspection**: React DevTools for state debugging

## Future Enhancements

### Planned Features
- **Offline Support**: Queue failed APIs for later retry
- **Background Sync**: Continue processing when app is backgrounded
- **Data Validation**: Enhanced response data validation
- **Performance Metrics**: Detailed timing and performance data

### Scalability Improvements
- **Batch Processing**: Group similar API calls
- **Parallel Execution**: Concurrent API processing where safe
- **Caching Layer**: Intelligent response caching
- **Queue Management**: Better handling of large API sets

## Conclusion

This Activity Screen implementation provides a robust, user-friendly interface for data synchronization with comprehensive error handling, retry mechanisms, and progress tracking. The single API call guarantee ensures efficient resource usage while the dependency-based execution maintains data integrity and user experience.
