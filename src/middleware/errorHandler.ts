import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  details?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorDetails = err.details || err.name || 'Error';

  logger.error(`API Error [${req.method} ${req.url}]: ${message}`, {
    statusCode,
    error: errorDetails,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};
