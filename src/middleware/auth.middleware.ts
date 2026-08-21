import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'ajp_production_super_secure_jwt_secret_change_in_env_2026';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

export interface AuthJwtPayload {
  userId: string;
  email: string;
  role: string;
  journalRoles?: { role: string; journalId: string }[];
  isVerified?: boolean;
}

export class AuthService {
  /**
   * Generates a secure short-lived Access Token
   */
  static generateAccessToken(payload: AuthJwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
      algorithm: 'HS256'
    });
  }

  /**
   * Generates a Refresh Token
   */
  static generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN as any,
      algorithm: 'HS256'
    });
  }

  /**
   * Verifies a JWT token
   */
  static verifyToken(token: string): AuthJwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthJwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Sets secure HTTP-only cookie on response with CSRF-safe settings
   */
  static setAuthCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('ajp_auth_token', token, {
      httpOnly: true,
      secure: isProduction, // HTTPS in production
      sameSite: 'lax', // Protect against CSRF while allowing standard navigation
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      path: '/'
    });
  }

  /**
   * Clears auth cookie
   */
  static clearAuthCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('ajp_auth_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/'
    });
  }
}

/**
 * Express Authentication Middleware: Extracts & validates JWT from HTTP-only cookie or Authorization header
 */
export function requireAuth(req: Request & { user?: AuthJwtPayload }, res: Response, next: NextFunction) {
  let token = req.cookies?.ajp_auth_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. No session token provided.' });
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
  }

  req.user = payload;
  next();
}

/**
 * Role-Based Access Control Middleware (Global or journal-scoped)
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request & { user?: AuthJwtPayload }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole || userRole === 'admin');

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Requires one of [${allowedRoles.join(', ')}] privileges.`
      });
    }

    next();
  };
}
