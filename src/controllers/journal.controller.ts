import { Request, Response } from 'express';
import { JournalService } from '../services/journal.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getParam } from '../utils/request';

export class JournalController {
  static getJournals = asyncHandler(async (_req: Request, res: Response) => {
    const journals = await JournalService.getAllJournals();
    return ApiResponseHelper.success(res, journals);
  });

  static getJournalById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const journal = await JournalService.getJournalById(id);
    if (!journal) {
      return ApiResponseHelper.error(res, 'Journal not found', 'Not Found', 404);
    }
    return ApiResponseHelper.success(res, journal);
  });

  static createJournal = asyncHandler(async (req: Request, res: Response) => {
    const created = await JournalService.createJournal(req.body);
    return ApiResponseHelper.success(res, created, 201);
  });

  static updateJournal = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const updated = await JournalService.updateJournal(id, req.body);
    return ApiResponseHelper.success(res, updated);
  });

  static deleteJournal = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const success = await JournalService.deleteJournal(id);
    return ApiResponseHelper.success(res, { id, deleted: success });
  });
}
