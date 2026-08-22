/**
 * Academic Journal Platform (AJP) - Hostinger / cPanel Entry Point
 * 
 * Supports both CommonJS and ES Module loaders natively.
 */

// If running in CommonJS (e.g. Passenger / standard Node runtime)
if (typeof require !== 'undefined') {
  require('./dist/server.cjs');
} else {
  // If running in ESM loader
  import('./dist/server.cjs');
}
