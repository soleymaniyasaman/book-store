import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Enable production mode if we're in production environment
if (environment.production) {
  enableProdMode();
  
  // Disable console.log in production
  if (window.console) {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.log = function(...args) {
      // Only log if not in production or if explicitly allowed
      if (!environment.production) {
        originalConsoleLog.apply(console, args);
      }
    };
    
    // Always keep error and warning logs
    console.error = function(...args) {
      originalConsoleError.apply(console, args);
    };
    
    console.warn = function(...args) {
      originalConsoleWarn.apply(console, args);
    };
  }
}

// Bootstrap the application
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error('Application initialization error:', err));

// Add version info to console in development mode
if (!environment.production) {
  console.log(`Book Store v${environment.appVersion} running in ${environment.production ? 'production' : 'development'} mode`);
}