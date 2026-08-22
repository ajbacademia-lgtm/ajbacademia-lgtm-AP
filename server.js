/**
 * Academic Journal Platform (AJP) - Hostinger / cPanel Entry Point (alias)
 *
 * Some hosting panels default to "server.js" as the Node.js startup file
 * name. This is identical to app.js — see that file for details.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('./dist/server.cjs');
