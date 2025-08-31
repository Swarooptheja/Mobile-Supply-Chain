// Test script to debug API configuration
// Run this in your React Native environment to test URL construction

import { ActivityService } from './src/services/activityService';

console.log('Testing API Configuration...');

try {
  // Test the SHIP_CONFIRM API specifically
  console.log('\n=== Testing SHIP_CONFIRM API ===');
  const testOrgId = '12345';
  const url = ActivityService['buildApiUrl']('SHIP_CONFIRM', testOrgId);
  console.log('✅ SHIP_CONFIRM URL:', url);
  
  // Test all API configurations
  console.log('\n=== Testing All API Configurations ===');
  ActivityService.validateAllApiConfigs();
  
} catch (error) {
  console.error('❌ Test failed:', error);
}
