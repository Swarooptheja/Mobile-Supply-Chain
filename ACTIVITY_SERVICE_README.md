# Activity Service Updates

This document describes the updates made to the `ActivityService` to properly handle URL placeholders and responsibility matching.

## 🔧 Changes Made

### 1. URL Placeholder Replacement

The `buildApiUrl` method now handles both `{orgId}` and `{defaultOrgId}` placeholders:

```typescript
// Before: Only handled {orgId}
private static buildApiUrl(apiName: string, orgId: string): string

// After: Handles both placeholders
private static buildApiUrl(apiName: string, orgId: string, defaultOrgId?: string | null): string
```

**Example URL replacements:**
- `"getItemsTable/{orgId}"` → `"getItemsTable/123"` (when orgId = "123")
- `"getglaccounts/{defaultOrgId}"` → `"getglaccounts/456"` (when defaultOrgId = "456")
- `"getInventoryPeriods/{defaultOrgId}/{orgId}"` → `"getInventoryPeriods/456/123"` (when both are provided)

### 2. Responsibility Mapping

Updated the responsibility mapping in `useUserResponsibilities` hook to include:

```typescript
const responsibilityMap: Record<string, string> = {
  'MOVE COMPLETION PACK': 'SHIP_CONFIRM',
  'SHIP CONFIRM': 'SHIP_CONFIRM',  // Added this mapping
  'INVENTORY MANAGEMENT': 'ITEM',
  'ACCOUNTING': 'ACCOUNT',
  'LOCATION MANAGEMENT': 'LOCATORS',
  'SUB INVENTORY': 'SUB_INV',
  'REASON CODES': 'REASON',
  'PERIOD MANAGEMENT': 'GL_PERIODS',
  'INVENTORY PERIODS': 'INVENTORY_PERIODS',
};
```

### 3. API Processing Updates

The `processApi` method now accepts and uses the `defaultOrgId` parameter:

```typescript
// Before: Only orgId
static async processApi(apiName: string, orgId: string, abortSignal?: AbortSignal)

// After: Includes defaultOrgId
static async processApi(apiName: string, orgId: string, defaultOrgId?: string | null, abortSignal?: AbortSignal)
```

### 4. Debugging and Testing

Added comprehensive logging and test methods:

- **URL Replacement Test**: `ActivityService.testUrlReplacement()`
- **Responsibility Filtering Test**: `ActivityService.testResponsibilityFiltering()`
- **API Configuration Validation**: `ActivityService.validateAllApiConfigs()`
- **Debug Logging**: Added throughout the filtering and processing methods

## 🧪 Testing the Changes

### Test URL Replacement

```typescript
// In your component or test file
import { ActivityService } from '../services/activityService';

// Test URL replacement
ActivityService.testUrlReplacement();
```

### Test Responsibility Filtering

```typescript
// Test responsibility filtering
ActivityService.testResponsibilityFiltering();
```

### Test API Configuration

```typescript
// Validate all API configurations
ActivityService.validateAllApiConfigs();
```

### Test Complete Flow

```typescript
// Test the complete responsibility filtering and URL replacement flow
ActivityService.testCompleteFlow();
```

This comprehensive test will:
- Test responsibility filtering for all API types
- Test URL construction with both placeholders
- Show the complete flow from responsibilities to constructed URLs

## 📋 API Configuration Examples

### Master APIs (require orgId)
```typescript
ITEM: {
  url: "getItemsTable/{orgId}",
  type: 'master',
  requiresOrgId: true,
  requiresDefaultOrgId: false,
  // ...
}
```

### Config APIs (require defaultOrgId)
```typescript
ACCOUNT: {
  url: "getglaccounts/{defaultOrgId}",
  type: 'config',
  requiresOrgId: false,
  requiresDefaultOrgId: true,
  // ...
}
```

### Transactional APIs (require orgId)
```typescript
SHIP_CONFIRM: {
  url: "EBS/23B/getSalesOrdersForShippingTable/{orgId}",
  type: 'transactional',
  requiresOrgId: true,
  requiresDefaultOrgId: false,
  // ...
}
```

## 🔍 Debugging

The service now includes extensive logging to help debug issues:

1. **Responsibility Processing**: Logs each responsibility as it's processed
2. **API Filtering**: Shows which APIs are found for each responsibility type
3. **URL Construction**: Logs the final constructed URLs
4. **Error Details**: Enhanced error logging with context information

## 🚀 Usage

The updated service automatically:

1. **Extracts responsibilities** from login response
2. **Maps responsibility names** to API keys (e.g., "SHIP CONFIRM" → "SHIP_CONFIRM")
3. **Filters APIs** based on user responsibilities
4. **Replaces URL placeholders** with actual values
5. **Processes APIs** in the correct order (master → config → transactional)

## 📱 Example Flow

1. **Login**: User logs in with "SHIP CONFIRM" responsibility
2. **Extraction**: System extracts "SHIP CONFIRM" from login response
3. **Mapping**: Maps "SHIP CONFIRM" to "SHIP_CONFIRM" API key
4. **Filtering**: Finds SHIP_CONFIRM in TRANSACTIONAL_APIS
5. **URL Construction**: Replaces `{orgId}` with selected organization ID
6. **API Processing**: Calls the constructed URL with proper parameters

This ensures that users only see and process APIs relevant to their responsibilities, and that all URL placeholders are properly replaced with actual values from their login and organization selection.
