export const environment = {
    production: true,
    apiUrl: 'https://api.book-store.com/api',
    eventGeneratorIntervalMs: 30000, // 30 seconds in production to reduce load
    logLevel: 'error', // Only log errors in production
    appVersion: '1.0.0',
    mockDataEnabled: false, // In production, we would use real API data
    featureFlags: {
      enableDarkMode: true,
      enableEventLogging: true,
      enableAdvancedSearch: true
    }
  };