# 🗄️ SQLite Implementation Guide

This document describes the comprehensive SQLite implementation for the Propel Apps mobile application, providing dynamic database management for current and future APIs.

## 📋 Overview

The SQLite implementation provides:
- **Dynamic table creation** for any new API endpoint
- **Automatic data persistence** with proper relationships
- **Caching system** for API responses
- **Scalable architecture** for future API integrations
- **Type-safe database operations** with TypeScript

## 🏗️ Architecture

### Core Components

#### 1. **Database Service** (`src/services/database.ts`)
- **Primary database interface** with SQLite operations
- **Table management** (create, drop, check existence)
- **CRUD operations** (insert, select, update, delete)
- **Transaction support** for complex operations
- **Helper functions** for common operations

#### 2. **Storage Service** (`src/services/storage.ts`)
- **High-level storage interface** for app data
- **User session management** with current user tracking
- **API response caching** with expiration
- **Settings management** for app configuration

#### 3. **Dynamic API Service** (`src/services/dynamicApi.ts`)
- **Endpoint registration** with automatic table creation
- **API request handling** with caching
- **Database integration** for response storage
- **Custom table management** for new APIs

## 📊 Database Schema

### Default Tables

#### 1. **Users Table**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  userId TEXT NOT NULL,
  personId TEXT,
  fullName TEXT,
  defaultOrgId TEXT,
  defaultInvOrgName TEXT,
  setOfBookId TEXT,
  responsibilityId TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **Responsibilities Table**
```sql
CREATE TABLE responsibilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  responsibility TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **Organizations Table**
```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  org_name TEXT,
  is_default BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **API Responses Table** (Caching)
```sql
CREATE TABLE api_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_data TEXT,
  response_data TEXT NOT NULL,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT
);
```

#### 5. **App Settings Table**
```sql
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Usage Examples

### 1. **Adding a New API Endpoint**

```typescript
import { dynamicApiService } from '../services/dynamicApi';

// Register a new endpoint with automatic table creation
dynamicApiService.registerEndpoint({
  name: 'inventory_items',
  method: 'GET',
  path: 'inventory/items',
  requiresAuth: true,
  cacheEnabled: true,
  cacheExpiryMinutes: 30,
  tableName: 'inventory_items',
  tableSchema: [
    { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'AUTOINCREMENT'] },
    { name: 'item_id', type: 'TEXT', constraints: ['NOT NULL', 'UNIQUE'] },
    { name: 'item_name', type: 'TEXT', constraints: ['NOT NULL'] },
    { name: 'category', type: 'TEXT' },
    { name: 'quantity', type: 'INTEGER', constraints: ['DEFAULT 0'] },
    { name: 'unit_price', type: 'REAL' },
    { name: 'location', type: 'TEXT' },
    { name: 'is_active', type: 'BOOLEAN', constraints: ['DEFAULT 1'] },
    { name: 'created_at', type: 'TEXT', constraints: ['DEFAULT CURRENT_TIMESTAMP'] },
  ],
});

// Make API request
const response = await dynamicApiService.request({
  endpoint: 'inventory_items',
  method: 'GET',
  useCache: true,
  cacheExpiryMinutes: 30,
});

if (response.success) {
  console.log('Inventory items:', response.data);
}
```

### 2. **Creating Custom Tables**

```typescript
import { databaseService } from '../services/database';

// Create a custom table for tracking shipments
await databaseService.createTable('shipments', [
  { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'AUTOINCREMENT'] },
  { name: 'shipment_id', type: 'TEXT', constraints: ['NOT NULL', 'UNIQUE'] },
  { name: 'origin', type: 'TEXT', constraints: ['NOT NULL'] },
  { name: 'destination', type: 'TEXT', constraints: ['NOT NULL'] },
  { name: 'status', type: 'TEXT', constraints: ['DEFAULT "pending"'] },
  { name: 'created_by', type: 'TEXT', constraints: ['NOT NULL'] },
  { name: 'created_at', type: 'TEXT', constraints: ['DEFAULT CURRENT_TIMESTAMP'] },
  { name: 'updated_at', type: 'TEXT', constraints: ['DEFAULT CURRENT_TIMESTAMP'] },
]);

// Insert data
const shipmentId = await databaseService.insert('shipments', {
  shipment_id: 'SHIP-001',
  origin: 'Warehouse A',
  destination: 'Store B',
  status: 'in_transit',
  created_by: 'user123',
});

// Query data
const shipments = await databaseService.select('shipments', ['*'], {
  status: 'in_transit'
});
```

### 3. **Database Operations**

```typescript
import { dbHelpers } from '../services/database';

// User operations
await dbHelpers.saveUser({
  id: 'user123',
  username: 'john.doe',
  name: 'John Doe',
  userId: '1015845',
  // ... other fields
});

const user = await dbHelpers.getUser('user123');

// Responsibility operations
await dbHelpers.saveResponsibilities('user123', [
  'MOVE COMPLETION PACK',
  'PUTAWAY',
  'INVENTORY MANAGEMENT'
]);

const responsibilities = await dbHelpers.getResponsibilities('user123');

// Organization operations
await dbHelpers.saveOrganization('user123', '888', 'Vision France', true);
const defaultOrg = await dbHelpers.getDefaultOrganization('user123');

// Settings operations
await dbHelpers.saveSetting('theme', 'dark');
await dbHelpers.saveSetting('language', 'en');
const theme = await dbHelpers.getSetting('theme');
```

### 4. **API Response Caching**

```typescript
import { storageService } from '../services/storage';

// Save API response with cache
await storageService.saveApiResponse(
  'inventory/items',
  'GET',
  { category: 'electronics' },
  { items: [...] },
  60 // Cache for 60 minutes
);

// Retrieve cached response
const cachedResponse = await storageService.getCachedApiResponse(
  'inventory/items',
  'GET',
  { category: 'electronics' }
);
```

## 🔧 Advanced Features

### 1. **Transaction Support**

```typescript
import { databaseService } from '../services/database';

// Execute multiple operations in a transaction
await databaseService.executeTransaction([
  {
    query: 'INSERT INTO users (id, username, name) VALUES (?, ?, ?)',
    params: ['user123', 'john.doe', 'John Doe']
  },
  {
    query: 'INSERT INTO responsibilities (user_id, responsibility) VALUES (?, ?)',
    params: ['user123', 'INVENTORY_MANAGER']
  },
  {
    query: 'INSERT INTO organizations (id, user_id, org_id, is_default) VALUES (?, ?, ?, ?)',
    params: ['user123_888', 'user123', '888', 1]
  }
]);
```

### 2. **Dynamic Table Management**

```typescript
import { databaseService } from '../services/database';

// Check if table exists
const tableExists = await databaseService.tableExists('custom_table');

// Get table information
const tableInfo = await databaseService.getTableInfo('users');

// Drop table
await databaseService.dropTable('old_table');
```

### 3. **Complex Queries**

```typescript
import { databaseService } from '../services/database';

// Select with conditions and ordering
const users = await databaseService.select(
  'users',
  ['id', 'username', 'name'],
  { is_active: 1 },
  'name ASC',
  10
);

// Update with conditions
const updatedRows = await databaseService.update(
  'users',
  { last_login: new Date().toISOString() },
  { id: 'user123' }
);

// Delete with conditions
const deletedRows = await databaseService.delete(
  'api_responses',
  { expires_at: { '<': new Date().toISOString() } }
);
```

## 📱 Integration with React Native

### 1. **App Initialization**

```typescript
// In App.tsx or index.js
import { databaseService } from './src/services/database';

const initializeApp = async () => {
  try {
    await databaseService.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Call during app startup
initializeApp();
```

### 2. **Context Integration**

```typescript
// In AuthContext.tsx
import { databaseService } from '../services/database';

useEffect(() => {
  const initializeApp = async () => {
    await databaseService.init();
    // Load stored data...
  };
  initializeApp();
}, []);
```

## 🔒 Security Considerations

### 1. **Data Protection**
- **No sensitive data in logs** - Passwords and tokens are never logged
- **SQL injection prevention** - All queries use parameterized statements
- **Data validation** - Input sanitization before database operations

### 2. **Access Control**
- **User-specific data** - All data is scoped to current user
- **Session management** - Proper user session tracking
- **Data isolation** - Users can only access their own data

## 🐛 Troubleshooting

### Common Issues

#### 1. **Database Initialization Failed**
```typescript
// Check database permissions and storage
try {
  await databaseService.init();
} catch (error) {
  console.error('Database init error:', error);
  // Fallback to AsyncStorage or show error message
}
```

#### 2. **Table Creation Failed**
```typescript
// Check if table already exists
const tableExists = await databaseService.tableExists('table_name');
if (!tableExists) {
  await databaseService.createTable('table_name', columns);
}
```

#### 3. **Data Not Persisting**
```typescript
// Ensure database is initialized
if (!databaseService.isInitialized()) {
  await databaseService.init();
}

// Check for transaction errors
try {
  await databaseService.executeTransaction(queries);
} catch (error) {
  console.error('Transaction failed:', error);
}
```

## 📝 Best Practices

### 1. **Table Design**
- **Use appropriate data types** - TEXT for strings, INTEGER for numbers
- **Add constraints** - NOT NULL, UNIQUE, PRIMARY KEY where needed
- **Include timestamps** - created_at, updated_at for tracking
- **Plan for relationships** - Foreign keys and indexes

### 2. **Performance**
- **Use indexes** for frequently queried columns
- **Limit query results** with LIMIT clause
- **Cache frequently accessed data** with appropriate expiration
- **Batch operations** using transactions

### 3. **Error Handling**
- **Always use try-catch** around database operations
- **Log errors** for debugging
- **Provide fallbacks** for critical operations
- **Validate data** before database operations

## 🔮 Future Enhancements

### Planned Features
- [ ] **Database migrations** - Version control for schema changes
- [ ] **Data encryption** - Encrypt sensitive data at rest
- [ ] **Backup/restore** - Database backup and recovery
- [ ] **Sync capabilities** - Offline/online data synchronization
- [ ] **Query builder** - Type-safe query construction
- [ ] **Performance monitoring** - Database performance metrics

### API Extensions
- [ ] **Bulk operations** - Batch insert/update/delete
- [ ] **Advanced caching** - LRU cache with memory management
- [ ] **Data validation** - Schema validation for API responses
- [ ] **Audit logging** - Track all database operations

## 📞 Support

For technical support or questions:
- **Database Issues** - Check console logs for SQLite errors
- **Performance Issues** - Review query optimization
- **Schema Changes** - Use database migrations
- **Integration Issues** - Verify service initialization order

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Compatibility:** React Native 0.81.0+, SQLite 3.x
