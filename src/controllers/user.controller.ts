import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getParam } from '../utils/request';

export class UserController {
  static getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    return ApiResponseHelper.success(res, users);
  });

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const user = await UserService.getUserById(id);
    if (!user) {
      return ApiResponseHelper.error(res, 'User not found', 'Not Found', 404);
    }
    return ApiResponseHelper.success(res, user);
  });

  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const created = await UserService.createUser(req.body);
    return ApiResponseHelper.success(res, created, 201);
  });

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const updated = await UserService.updateUser(id, req.body);
    return ApiResponseHelper.success(res, updated);
  });

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const success = await UserService.deleteUser(id);
    return ApiResponseHelper.success(res, { id, deleted: success });
  });
}
