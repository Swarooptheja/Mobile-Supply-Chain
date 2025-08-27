import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDynamicTables } from '../hooks';
import { TableNames } from '../constants/tables';
import { ITableMetadata } from '../types/database';

interface IDynamicTableManagerProps {
  onTableCreated?: (tableName: string, result: any) => void;
}

const DynamicTableManager: React.FC<IDynamicTableManagerProps> = ({ 
  onTableCreated 
}) => {
  const {
    isLoading,
    error,
    lastOperation,
    createTableFromApiResponse,
    getTableSchema,
    tableExists,
    dropTable,
    clearError,
  } = useDynamicTables();

  const [tableSchemas, setTableSchemas] = useState<Record<string, ITableMetadata>>({});
  const [existingTables, setExistingTables] = useState<string[]>([]);

  // Load existing tables on component mount
  useEffect(() => {
    loadExistingTables();
  }, []);

  const loadExistingTables = async () => {
    try {
      const tables = Object.values(TableNames);
      const existing: string[] = [];
      const schemas: Record<string, ITableMetadata> = {};

      for (const tableName of tables) {
        const exists = await tableExists(tableName);
        if (exists) {
          existing.push(tableName);
          const schema = await getTableSchema(tableName);
          if (schema) {
            schemas[tableName] = schema;
          }
        }
      }

      setExistingTables(existing);
      setTableSchemas(schemas);
    } catch (err) {
      console.error('Error loading existing tables:', err);
    }
  };

  const handleCreateTestTable = async () => {
    try {
      // Sample API response metadata and data
      const testMetadata = [
        { name: 'STATUS', type: 'string' },
        { name: 'USER_NAME', type: 'string' },
        { name: 'USER_ID', type: 'number' },
        { name: 'FULL_NAME', type: 'string' },
        { name: 'PERSON_ID', type: 'number' },
        { name: 'RESPONSIBILITY', type: 'string' },
        { name: 'SET_OF_BOOK_ID', type: 'number' },
        { name: 'DEFAULT_ORG_ID', type: 'number' },
        { name: 'DEFAULT_OU_NAME', type: 'string' },
        { name: 'DEFAULT_INV_ORG_ID', type: 'number' },
        { name: 'DEFAULT_INV_ORG_NAME', type: 'string' },
        { name: 'DEFAULT_INV_ORG_CODE', type: 'string' },
        { name: 'RESPONSIBILITY_ID', type: 'number' },
        { name: 'RESP_APPLICATION_ID', type: 'number' },
      ];

      const testData = [
        {
          STATUS: '1',
          USER_NAME: 'testuser',
          USER_ID: 12345,
          FULL_NAME: 'Test User',
          PERSON_ID: 67890,
          RESPONSIBILITY: 'System Administrator',
          SET_OF_BOOK_ID: 1,
          DEFAULT_ORG_ID: 100,
          DEFAULT_OU_NAME: 'Test Organization',
          DEFAULT_INV_ORG_ID: 200,
          DEFAULT_INV_ORG_NAME: 'Test Inventory Org',
          DEFAULT_INV_ORG_CODE: 'TIO',
          RESPONSIBILITY_ID: 300,
          RESP_APPLICATION_ID: 400,
        },
      ];

      const result = await createTableFromApiResponse(
        TableNames.LOGIN,
        testMetadata,
        testData
      );

      if (result.success) {
        Alert.alert(
          'Success',
          `Table '${result.tableName}' created successfully!\nColumns: ${result.columnsCreated}\nRows: ${result.rowsInserted}`
        );
        onTableCreated?.(result.tableName, result);
        await loadExistingTables(); // Refresh the list
      } else {
        Alert.alert('Error', `Failed to create table: ${result.error}`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to create test table');
    }
  };

  const handleDropTable = async (tableName: string) => {
    Alert.alert(
      'Confirm Drop',
      `Are you sure you want to drop table '${tableName}'?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Drop',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await dropTable(tableName);
              if (success) {
                Alert.alert('Success', `Table '${tableName}' dropped successfully`);
                await loadExistingTables(); // Refresh the list
              } else {
                Alert.alert('Error', `Failed to drop table '${tableName}'`);
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to drop table');
            }
          },
        },
      ]
    );
  };

  const renderTableInfo = (tableName: string) => {
    const schema = tableSchemas[tableName];
    return (
      <View key={tableName} style={styles.tableInfo}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableName}>{tableName}</Text>
          <TouchableOpacity
            style={styles.dropButton}
            onPress={() => handleDropTable(tableName)}
          >
            <Text style={styles.dropButtonText}>Drop</Text>
          </TouchableOpacity>
        </View>
        
        {schema && (
          <View style={styles.schemaInfo}>
            <Text style={styles.schemaTitle}>Columns ({schema.columns.length}):</Text>
            {schema.columns.map((column, index) => (
              <Text key={index} style={styles.columnInfo}>
                • {column.name} ({column.type})
                {column.primaryKey && ' [PK]'}
                {!column.nullable && ' [NOT NULL]'}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dynamic Table Manager</Text>
        <Text style={styles.subtitle}>
          Manage tables created from API responses
        </Text>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.clearErrorButton} onPress={clearError}>
            <Text style={styles.clearErrorText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Last Operation Result */}
      {lastOperation && (
        <View style={styles.lastOperationContainer}>
          <Text style={styles.lastOperationTitle}>Last Operation:</Text>
          <Text style={styles.lastOperationText}>
            Table: {lastOperation.tableName}
          </Text>
          <Text style={styles.lastOperationText}>
            Success: {lastOperation.success ? 'Yes' : 'No'}
          </Text>
          {lastOperation.success && (
            <>
              <Text style={styles.lastOperationText}>
                Columns Created: {lastOperation.columnsCreated}
              </Text>
              <Text style={styles.lastOperationText}>
                Rows Inserted: {lastOperation.rowsInserted}
              </Text>
            </>
          )}
          {lastOperation.error && (
            <Text style={styles.errorText}>Error: {lastOperation.error}</Text>
          )}
        </View>
      )}

      {/* Create Test Table Button */}
      <TouchableOpacity
        style={[styles.createButton, isLoading && styles.buttonDisabled]}
        onPress={handleCreateTestTable}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.createButtonText}>Create Test Login Table</Text>
        )}
      </TouchableOpacity>

      {/* Existing Tables */}
      <View style={styles.existingTablesContainer}>
        <Text style={styles.sectionTitle}>
          Existing Tables ({existingTables.length})
        </Text>
        
        {existingTables.length === 0 ? (
          <Text style={styles.noTablesText}>No tables found</Text>
        ) : (
          existingTables.map(renderTableInfo)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    flex: 1,
  },
  clearErrorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f44336',
    borderRadius: 4,
  },
  clearErrorText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  lastOperationContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  lastOperationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  lastOperationText: {
    fontSize: 14,
    color: '#388e3c',
    marginBottom: 4,
  },
  createButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  existingTablesContainer: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  noTablesText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tableInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  dropButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f44336',
    borderRadius: 4,
  },
  dropButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  schemaInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  schemaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  columnInfo: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default DynamicTableManager;
