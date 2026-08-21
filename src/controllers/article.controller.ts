import { Request, Response } from 'express';
import { ArticleService } from '../services/article.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getParam, getQuery } from '../utils/request';

export class ArticleController {
  static getArticles = asyncHandler(async (req: Request, res: Response) => {
    const status = getQuery(req, 'status');
    const articles = await ArticleService.getAllArticles(status);
    return ApiResponseHelper.success(res, articles);
  });

  static getArticlesByJournal = asyncHandler(async (req: Request, res: Response) => {
    const journalId = getParam(req, 'journalId');
    const articles = await ArticleService.getArticlesByJournal(journalId);
    return ApiResponseHelper.success(res, articles);
  });

  static getArticlesByIssue = asyncHandler(async (req: Request, res: Response) => {
    const issueId = getParam(req, 'issueId');
    const articles = await ArticleService.getArticlesByIssue(issueId);
    return ApiResponseHelper.success(res, articles);
  });

  static getArticleById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const article = await ArticleService.getArticleById(id);
    if (!article) {
      return ApiResponseHelper.error(res, 'Article not found', 'Not Found', 404);
    }
    return ApiResponseHelper.success(res, article);
  });

  static createArticle = asyncHandler(async (req: Request, res: Response) => {
    const created = await ArticleService.createArticle(req.body);
    return ApiResponseHelper.success(res, created, 201);
  });

  static updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const updated = await ArticleService.updateArticle(id, req.body);
    return ApiResponseHelper.success(res, updated);
  });

  static deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const success = await ArticleService.deleteArticle(id);
    return ApiResponseHelper.success(res, { id, deleted: success });
  });
}
