import { Request, Response } from 'express';
import { AnnouncementService } from '../services/announcement.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getParam } from '../utils/request';

export class AnnouncementController {
  static getAnnouncements = asyncHandler(async (_req: Request, res: Response) => {
    const announcements = await AnnouncementService.getAllAnnouncements();
    return ApiResponseHelper.success(res, announcements);
  });

  static getAnnouncementById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const item = await AnnouncementService.getAnnouncementById(id);
    if (!item) {
      return ApiResponseHelper.error(res, 'Announcement not found', 'Not Found', 404);
    }
    return ApiResponseHelper.success(res, item);
  });

  static createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const created = await AnnouncementService.createAnnouncement(req.body);
    return ApiResponseHelper.success(res, created, 201);
  });

  static updateAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const updated = await AnnouncementService.updateAnnouncement(id, req.body);
    return ApiResponseHelper.success(res, updated);
  });

  static deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const success = await AnnouncementService.deleteAnnouncement(id);
    return ApiResponseHelper.success(res, { id, deleted: success });
  });
}
