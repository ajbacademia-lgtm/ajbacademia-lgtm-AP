import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server.ts';

/**
 * Serverless function entrypoint for platforms like Vercel, Netlify Functions, etc.
 * Handles incoming API requests and forwards them to the Express application instance.
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
