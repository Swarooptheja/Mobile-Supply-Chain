# Dynamic Table System

This document describes the implementation of a dynamic table creation system that automatically creates SQLite tables based on API response metadata.

## Overview

The dynamic table system allows the application to:
1. Receive API responses with metadata describing the schema
2. Automatically create SQLite tables based on the metadata
3. Insert the response data into the created tables
4. Manage and query the tables using consistent naming conventions

## Architecture

### Core Components

#### 1. Constants (`src/constants/tables.ts`)
- **TableNames enum**: Defines all table names as constants for consistency
- **TABLE_SCHEMAS**: Provides metadata about each table type

```typescript
export enum TableNames {
  LOGIN = 'login',
  USER_PROFILE = 'user_profile',
  RESPONSIBILITIES = 'responsibilities',
  ORGANIZATIONS = 'organizations',
  SETTINGS = 'settings',
}
```

#### 2. Types (`src/types/database.ts`)
- **IColumnMetadata**: Defines column structure
- **ITableMetadata**: Defines table structure
- **ITableCreationResult**: Result of table creation operations
- **IDynamicTableService**: Interface for dynamic table operations
- **IApiResponseMetadata**: API response metadata structure

#### 3. Services (`src/services/dynamicTableService.ts`)
- **DynamicTableService**: Core service for table operations
- Handles metadata conversion, SQL generation, and data insertion
- Provides table management functions (create, drop, query)

#### 4. Hooks (`src/hooks/useDynamicTables.ts`)
- **useDynamicTables**: React hook for table operations
- Provides state management and error handling
- Follows React Native best practices

#### 5. Utilities (`src/utils/tableUtils.ts`)
- Validation functions for metadata and data
- Column name sanitization for SQLite compatibility
- Logging and debugging utilities

## Usage

### Basic Table Creation

```typescript
import { useDynamicTables } from '../hooks';
import { TableNames } from '../constants/tables';

const MyComponent = () => {
  const { createTableFromApiResponse, isLoading, error } = useDynamicTables();

  const handleApiResponse = async (response) => {
    const result = await createTableFromApiResponse(
      TableNames.LOGIN,
      response.metadata,
      response.data
    );

    if (result.success) {
      console.log(`Table created: ${result.columnsCreated} columns, ${result.rowsInserted} rows`);
    }
  };
};
```

### Integration with AuthContext

The login process automatically creates a login table:

```typescript
// In AuthContext.tsx
const login = async (credentials: ILoginCredentials): Promise<void> => {
  const response = await loginApi(credentials);
  
  if (response.metadata && response.data) {
    const tableResult = await createTableFromApiResponse(
      TableNames.LOGIN,
      response.metadata,
      response.data
    );
    
    if (!tableResult.success) {
      throw new Error(`Failed to create login table: ${tableResult.error}`);
    }
  }
};
```

### Table Management

```typescript
const {
  getTableSchema,
  tableExists,
  dropTable,
  insertDataIntoTable
} = useDynamicTables();

// Check if table exists
const exists = await tableExists(TableNames.LOGIN);

// Get table schema
const schema = await getTableSchema(TableNames.LOGIN);

// Insert additional data
const insertedCount = await insertDataIntoTable(TableNames.LOGIN, newData);

// Drop table
const dropped = await dropTable(TableNames.LOGIN);
```

## API Response Format

The system expects API responses in this format:

```typescript
interface IApiResponse {
  metadata: Array<{
    name: string;    // Column name
    type: string;    // Data type (string, number, boolean, etc.)
  }>;
  data: any[];       // Array of data objects
}
```

Example:
```json
{
  "metadata": [
    { "name": "STATUS", "type": "string" },
    { "name": "USER_ID", "type": "number" },
    { "name": "FULL_NAME", "type": "string" }
  ],
  "data": [
    {
      "STATUS": "1",
      "USER_ID": 12345,
      "FULL_NAME": "John Doe"
    }
  ]
}
```

## Type Mapping

The system automatically maps API types to SQLite types:

| API Type | SQLite Type | Description |
|----------|-------------|-------------|
| string, text, varchar, char | TEXT | Text data |
| number, integer, int, bigint | INTEGER | Integer numbers |
| float, double, decimal | REAL | Floating point numbers |
| boolean, bool | INTEGER | Boolean (0/1) |
| date, datetime, timestamp | TEXT | Date/time as text |
| blob | BLOB | Binary data |

## Error Handling

The system provides comprehensive error handling:

- **Validation errors**: Invalid metadata or data structure
- **Database errors**: SQLite operation failures
- **Type conversion errors**: Unsupported data types
- **Network errors**: API connection issues

## Best Practices

### 1. Use Table Name Constants
Always use the `TableNames` enum instead of hardcoded strings:

```typescript
// ✅ Good
await createTableFromApiResponse(TableNames.LOGIN, metadata, data);

// ❌ Bad
await createTableFromApiResponse('login', metadata, data);
```

### 2. Handle Errors Gracefully
Always check operation results and handle errors:

```typescript
const result = await createTableFromApiResponse(tableName, metadata, data);
if (!result.success) {
  console.error('Table creation failed:', result.error);
  // Handle error appropriately
}
```

### 3. Validate Data Before Insertion
Use the utility functions to validate data:

```typescript
import { validateMetadata, validateDataAgainstMetadata } from '../utils/tableUtils';

if (!validateMetadata(metadata)) {
  throw new Error('Invalid metadata');
}

if (!validateDataAgainstMetadata(data, metadata)) {
  throw new Error('Data does not match metadata');
}
```

### 4. Use the Custom Hook
Always use the `useDynamicTables` hook instead of calling the service directly:

```typescript
// ✅ Good
const { createTableFromApiResponse } = useDynamicTables();

// ❌ Bad
import { dynamicTableService } from '../services/dynamicTableService';
```

## Testing

The `DynamicTableManager` component provides a UI for testing:

1. Create test tables with sample data
2. View table schemas and column information
3. Drop tables
4. Monitor operation results and errors

## Performance Considerations

- Tables are created with `IF NOT EXISTS` to avoid conflicts
- Data insertion uses prepared statements for efficiency
- Column names are sanitized to ensure SQLite compatibility
- Large datasets are processed row by row to manage memory usage

## Security

- Column names are sanitized to prevent SQL injection
- Input validation prevents malformed data
- Error messages don't expose sensitive information
- Database operations are wrapped in try-catch blocks

## Future Enhancements

1. **Index Management**: Automatic index creation for frequently queried columns
2. **Data Migration**: Schema versioning and migration support
3. **Caching**: Query result caching for improved performance
4. **Batch Operations**: Bulk insert operations for large datasets
5. **Schema Evolution**: Support for table schema updates
