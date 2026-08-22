/**
 * Academic Journal Platform (AJP) - Hostinger Entry Point
 * 
 * This file serves as the primary startup file for Hostinger Managed Node.js,
 * cPanel Phusion Passenger, PM2, and standard Node.js hosting environments.
 */

const path = require('path');
const fs = require('fs');

const serverBundle = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(serverBundle)) {
  require(serverBundle);
} else {
  console.error('[AJP Startup Error] "dist/server.cjs" not found.');
  console.error('Please run "npm run build" to compile frontend assets and backend bundle.');
  process.exit(1);
}
