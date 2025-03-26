// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    eventGeneratorIntervalMs: 15000, // 15 seconds
    logLevel: 'debug',
    appVersion: '1.0.0-dev',
    mockDataEnabled: true,
    featureFlags: {
      enableDarkMode: true,
      enableEventLogging: true,
      enableAdvancedSearch: true
    }
  };