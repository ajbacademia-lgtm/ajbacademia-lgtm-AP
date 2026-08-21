import { Request, Response } from 'express';
import { NewsService } from '../services/news.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getParam } from '../utils/request';

export class NewsController {
  static getNews = asyncHandler(async (_req: Request, res: Response) => {
    const news = await NewsService.getAllNews();
    return ApiResponseHelper.success(res, news);
  });

  static getNewsById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const item = await NewsService.getNewsById(id);
    if (!item) {
      return ApiResponseHelper.error(res, 'News item not found', 'Not Found', 404);
    }
    return ApiResponseHelper.success(res, item);
  });

  static createNews = asyncHandler(async (req: Request, res: Response) => {
    const created = await NewsService.createNews(req.body);
    return ApiResponseHelper.success(res, created, 201);
  });

  static updateNews = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const updated = await NewsService.updateNews(id, req.body);
    return ApiResponseHelper.success(res, updated);
  });

  static deleteNews = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const success = await NewsService.deleteNews(id);
    return ApiResponseHelper.success(res, { id, deleted: success });
  });
}
