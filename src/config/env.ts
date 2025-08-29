// Environment Configuration
export const ENV = {
  // App Version
  APP_VERSION: 'Propel.MSCA-V1.0.0',
  
  // API Configuration
  API_BASE_URL: 'https://api.propelapps.com',
  
  // Feature Flags
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: false,
  
  // App Configuration
  APP_NAME: 'Mobile Supply Chain',
  COMPANY_NAME: 'Propel Apps',
  COMPANY_TAGLINE: 'Transform Tomorrow. Today.',
  
  // Build Configuration
  BUILD_NUMBER: '1',
  BUILD_ENV: __DEV__ ? 'development' : 'production',
} as const;

// Helper function to get version string
export const getVersionString = (): string => {
  return `Version - ${ENV.APP_VERSION}`;
};
