/**
 * Academic Journal Platform (AJP) - Hostinger / cPanel Entry Point
 *
 * package.json declares "type": "module", so Node always loads this file
 * as an ES module when run directly (e.g. `node app.js`, or Phusion
 * Passenger spawning it as the configured startup file). There is no
 * global `require` in that context, so we use Node's createRequire to load
 * the CommonJS server bundle (dist/server.cjs) instead of a literal
 * dynamic import(). This also avoids a build-time issue where bundlers
 * (Vite/Rollup) can statically analyze a literal import('./dist/server.cjs')
 * and fail because that file does not exist yet at frontend-build time.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('./dist/server.cjs');
