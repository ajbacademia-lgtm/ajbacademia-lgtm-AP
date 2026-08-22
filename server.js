/**
 * Academic Journal Platform (AJP) - Hostinger / cPanel Entry Point
 * 
 * Supports both CommonJS and ES Module loaders natively.
 */

if (typeof require !== 'undefined') {
  require('./dist/server.cjs');
} else {
  import('./dist/server.cjs');
}
