import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiResponseHelper {
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    error: string = 'Internal Error',
    statusCode: number = 500
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }
}
