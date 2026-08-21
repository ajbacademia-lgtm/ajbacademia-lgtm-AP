import { Request, Response } from 'express';
import { IssueService } from '../services/issue.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getParam } from '../utils/request';

export class IssueController {
  static getIssues = asyncHandler(async (_req: Request, res: Response) => {
    const issues = await IssueService.getAllIssues();
    return ApiResponseHelper.success(res, issues);
  });

  static getIssuesByJournal = asyncHandler(async (req: Request, res: Response) => {
    const journalId = getParam(req, 'journalId');
    const issues = await IssueService.getIssuesByJournal(journalId);
    return ApiResponseHelper.success(res, issues);
  });

  static getIssueById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const issue = await IssueService.getIssueById(id);
    if (!issue) {
      return ApiResponseHelper.error(res, 'Issue not found', 'Not Found', 404);
    }
    return ApiResponseHelper.success(res, issue);
  });

  static createIssue = asyncHandler(async (req: Request, res: Response) => {
    const created = await IssueService.createIssue(req.body);
    return ApiResponseHelper.success(res, created, 201);
  });

  static updateIssue = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const updated = await IssueService.updateIssue(id, req.body);
    return ApiResponseHelper.success(res, updated);
  });

  static deleteIssue = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const success = await IssueService.deleteIssue(id);
    return ApiResponseHelper.success(res, { id, deleted: success });
  });
}
