import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class SettingsController {
  static getSettings = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await SettingsService.getSettings();
    return ApiResponseHelper.success(res, settings);
  });

  static updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const updated = await SettingsService.updateSettings(req.body);
    return ApiResponseHelper.success(res, updated);
  });
}
