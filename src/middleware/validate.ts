import { Request, Response, NextFunction } from 'express';
import { ApiResponseHelper } from '../utils/apiResponse';

export const validateRequiredBody = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== 'object') {
      return ApiResponseHelper.error(res, 'Request body is required', 'Validation Error', 400);
    }

    const missingFields = fields.filter((field) => req.body[field] === undefined || req.body[field] === null);
    if (missingFields.length > 0) {
      return ApiResponseHelper.error(
        res,
        `Missing required fields: ${missingFields.join(', ')}`,
        'Validation Error',
        400
      );
    }

    next();
  };
};

export const validateIdParam = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return ApiResponseHelper.error(res, `Invalid parameter: ${paramName}`, 'Validation Error', 400);
    }
    next();
  };
};
