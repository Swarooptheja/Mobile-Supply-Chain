# Activity Screen System

## Overview

The Activity Screen system provides a comprehensive, user-friendly interface for managing API data synchronization across different types of APIs (master, config, and transactional). It handles the entire process from API calls to data insertion, with proper error handling, progress tracking, and retry mechanisms.

## Architecture

### Core Components

#### 1. **ActivityScreen** (`src/screen/ActivityScreen.tsx`)
- **Main orchestrator** for the entire activity management system
- **Responsive design** with device-specific layouts
- **Progress overview** showing overall synchronization status
- **Action buttons** for retry, cancel, and proceed operations
- **Utility actions** for clearing errors and refreshing status

#### 2. **useActivityManager** (`src/hooks/useActivityManager.ts`)
- **Central state management** for all activities
- **Sequential API processing** (master → config → transactional)
- **Retry mechanism** with configurable attempts and delays
- **Process cancellation** with proper cleanup
- **Performance optimizations** with memoized computations

#### 3. **ActivityService** (`src/services/activityService.ts`)
- **API configuration management** for different responsibility types
- **URL building** with dynamic parameter substitution
- **API type detection** (table vs JSON responses)
- **Metadata handling** for JSON APIs
- **Validation** of required parameters

#### 4. **ActivityCard** (`src/components/ActivityCard.tsx`)
- **Individual API status display** with visual indicators
- **Expandable error details** for failed operations
- **Progress visualization** during processing
- **Retry functionality** for individual APIs
- **Timing information** and performance metrics

#### 5. **NotificationCenter** (`src/components/NotificationCenter.tsx`)
- **Dedicated error display** area at bottom of screen
- **Animated expansion** for better UX
- **Categorized notifications** (errors vs warnings)
- **Detailed information** including timestamps and retry counts

## API Processing Flow

### 1. **Sequential Processing Order**
```
Master APIs → Config APIs → Transactional APIs
```

**Rules:**
- Master and config APIs must succeed before transactional APIs
- If any master/config API fails, transactional APIs are blocked
- Each API type is processed as a group for better error handling

### 2. **API Categories**

#### **Master APIs**
- **ITEM**: Inventory item master data
- **ACCOUNT**: General ledger accounts
- **SUB_INV**: Sub-inventory locations
- **LOCATORS**: Physical location information

#### **Config APIs**
- **REASON**: Business reason codes
- **GL_PERIODS**: General ledger periods
- **INVENTORY_PERIODS**: Inventory accounting periods

#### **Transactional APIs**
- **SHIP_CONFIRM**: Shipping order data

### 3. **Response Types**

#### **Table Type APIs**
- Return data in array format: `[headers, ...dataRows]`
- No metadata required
- Examples: ITEM, LOCATORS, SHIP_CONFIRM

#### **JSON APIs**
- Return data with metadata
- Metadata fetched separately from `/metadata` endpoint
- Examples: ACCOUNT, SUB_INV, REASON, GL_PERIODS, INVENTORY_PERIODS

## Performance Optimizations

### 1. **Memoized Computations**
- Overall progress calculation
- Status-based filtering
- Component re-render prevention

### 2. **Efficient State Updates**
- Batch state updates where possible
- Minimal re-renders with proper dependency arrays
- Optimized activity status updates

### 3. **Memory Management**
- Proper cleanup of timeouts and abort controllers
- Component unmount handling
- Efficient list rendering with proper keys

## Error Handling

### 1. **API Failure Scenarios**
- Network errors
- Invalid responses
- Database insertion failures
- Parameter validation errors

### 2. **Retry Mechanism**
- **Maximum attempts**: 3 retries per API
- **Retry delay**: 2 seconds between attempts
- **Exponential backoff**: Prevents rapid retry loops
- **Individual retry**: Per-API retry functionality

### 3. **User Feedback**
- **Visual indicators**: Status icons and colors
- **Detailed error messages**: Expandable error details
- **Progress tracking**: Real-time status updates
- **Action guidance**: Clear next steps for users

## User Experience Features

### 1. **Visual Design**
- **Status-based colors**: Green (success), Red (error), Yellow (warning)
- **Progress bars**: Real-time progress visualization
- **Expandable cards**: Detailed information on demand
- **Responsive layout**: Works on all device sizes

### 2. **Interactive Elements**
- **Expandable error details**: Click to see full error information
- **Individual retry buttons**: Retry specific failed APIs
- **Bulk retry**: Retry all failed APIs at once
- **Process cancellation**: Stop ongoing synchronization

### 3. **Information Display**
- **Timing metrics**: Start time, end time, duration
- **Record counts**: Total vs inserted records
- **API metadata**: URLs, types, and parameters
- **Retry information**: Attempt counts and last retry time

## Integration Points

### 1. **Navigation Flow**
```
Login → Organization Selection → Activity Screen → Dashboard
```

### 2. **Data Sources**
- **User responsibilities**: Fetched from login table
- **Organization ID**: Selected by user
- **Default org ID**: From authentication context
- **API configurations**: Hardcoded in ActivityService

### 3. **Database Operations**
- **Table creation**: Dynamic table creation from API metadata
- **Data insertion**: Batch insertion with error handling
- **Transaction management**: Proper rollback on failures

## Configuration

### 1. **API Endpoints**
All API endpoints are configured in `ActivityService` with:
- Base URLs
- Parameter placeholders
- Response type specifications
- Required parameter validation

### 2. **Responsibility Mapping**
User responsibilities are mapped to API keys:
```typescript
const responsibilityMap = {
  'MOVE COMPLETION PACK': 'SHIP_CONFIRM',
  'INVENTORY MANAGEMENT': 'ITEM',
  'ACCOUNTING': 'ACCOUNT',
  // ... more mappings
};
```

### 3. **Retry Configuration**
```typescript
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;
```

## Usage Examples

### 1. **Starting Activity Process**
```typescript
const { startActivityProcess } = useActivityManager();

await startActivityProcess(orgId, responsibilities, defaultOrgId);
```

### 2. **Retrying Failed APIs**
```typescript
const { retryFailedApis } = useActivityManager();

// Retry all failed APIs
await retryFailedApis();

// Retry specific API
await retryFailedApis(['master_ITEM']);
```

### 3. **Monitoring Progress**
```typescript
const { overallProgress, activities } = useActivityManager();

console.log(`Progress: ${overallProgress.percentage}%`);
console.log(`Completed: ${overallProgress.current}/${overallProgress.total}`);
```

## Future Enhancements

### 1. **Planned Features**
- **Background processing**: Continue sync in background
- **Incremental sync**: Only sync changed data
- **Batch operations**: Process multiple organizations
- **Advanced filtering**: Filter by API type or status

### 2. **Performance Improvements**
- **Parallel processing**: Process independent APIs simultaneously
- **Caching**: Cache API responses for faster retries
- **Compression**: Compress large API responses
- **Streaming**: Stream large datasets

### 3. **Monitoring & Analytics**
- **Sync history**: Track all synchronization attempts
- **Performance metrics**: API response times and success rates
- **Error analytics**: Common failure patterns and solutions
- **User behavior**: Usage patterns and optimization opportunities

## Troubleshooting

### 1. **Common Issues**
- **API failures**: Check network connectivity and API endpoints
- **Database errors**: Verify SQLite initialization and permissions
- **Memory issues**: Check for memory leaks in long-running processes
- **Navigation errors**: Ensure proper route configuration

### 2. **Debug Information**
- **Console logs**: Detailed logging for all operations
- **Error details**: Expandable error information in UI
- **Status tracking**: Real-time status updates
- **Performance metrics**: Timing and record count information

### 3. **Recovery Steps**
- **Retry failed APIs**: Use retry functionality for transient failures
- **Clear errors**: Reset error state for clean retry
- **Cancel and restart**: Stop current process and start fresh
- **Check logs**: Review console logs for detailed error information

## Conclusion

The Activity Screen system provides a robust, user-friendly solution for managing complex API synchronization workflows. With its modular architecture, comprehensive error handling, and performance optimizations, it ensures reliable data synchronization while providing excellent user experience.

The system is designed to be:
- **Maintainable**: Clear separation of concerns and modular design
- **Scalable**: Easy to add new APIs and responsibility types
- **Reliable**: Comprehensive error handling and retry mechanisms
- **User-friendly**: Intuitive interface with clear feedback and guidance
