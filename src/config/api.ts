// API Configuration for Propel Apps
export const API_CONFIG = {
  // Development Environment
  development: {
    hostname: 'https://testnode.propelapps.com',
    project: 'EBS',
    version: '20D',
  },
  
  // Production Environment (update these values for production)
  production: {
    hostname: 'https://prod.propelapps.com', // Update with actual production URL
    project: 'EBS', // Update with actual project name
    version: '20D', // Update with actual version
  },
  
  // Staging Environment (update these values for staging)
  staging: {
    hostname: 'https://staging.propelapps.com', // Update with actual staging URL
    project: 'EBS', // Update with actual project name
    version: '20D', // Update with actual version
  },
};


export const API_VERSION = {
  EBS_20D: 'EBS/20D',
  EBS_23B: 'EBS/23B',
}

// Current environment - change this to switch between environments
export const CURRENT_ENVIRONMENT: keyof typeof API_CONFIG = 'development';

// Get current API configuration
export const getCurrentApiConfig = () => {
  return API_CONFIG[CURRENT_ENVIRONMENT];
};

// Build API URL helper
export const buildApiUrl = (endpoint: string): string => {
  const config = getCurrentApiConfig();
  return `${config.hostname}/${endpoint}`;
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_VERSION.EBS_20D}/login`,
  INVENTORY_ORGS: `${API_VERSION.EBS_20D}/getInventoryOrganizations`,
  INVENTORY_ORGS_METADATA: `${API_VERSION.EBS_20D}/getInventoryOrganizations/metadata`,
  SALES_ORDERS_SHIPPING: `${API_VERSION.EBS_23B}/getSalesOrdersForShippingTable`,
};

// API Headers
export const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // Add authentication headers if needed
  // 'Authorization': `Bearer ${token}`,
});

// API Timeout (in milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// Demo credentials (for testing purposes)
export const DEMO_CREDENTIALS = {
  username: 'manideep j',
  password: 'Propel@123',
};
