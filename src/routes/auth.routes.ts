import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getCollectionDocs, getCollectionDocById, saveCollectionDoc } from '../db/mysql';
import { AuthService, requireAuth, requireRole } from '../middleware/auth.middleware';
import { getAuthRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account with secure password hashing
 */
router.post('/register', getAuthRateLimiter(), async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, institution, department, orcid } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and full name are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUsers = await getCollectionDocs('users');
    const userExists = existingUsers.some((u: any) => u.email?.toLowerCase() === normalizedEmail);

    if (userExists) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }

    // Role assignment security: regular registrations default to 'author' or 'reader'
    const allowedRoles = ['author', 'reviewer', 'reader'];
    const assignedRole = allowedRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : 'author';

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser = {
      id: userId,
      email: normalizedEmail,
      name: name.trim(),
      role: assignedRole,
      institution: institution || '',
      department: department || '',
      orcid: orcid || '',
      passwordHash,
      isVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveCollectionDoc('users', userId, newUser);

    // Generate JWT access token & set secure HTTP-only cookie
    const token = AuthService.generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified
    });

    AuthService.setAuthCookie(res, token);

    // Strip password hash from response payload
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: safeUser,
      token
    });
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to create user account.' });
  }
});

/**
 * POST /api/auth/login
 * Standard email + password authentication with rate limiting & secure cookie
 */
router.post('/login', getAuthRateLimiter(), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const allUsers = await getCollectionDocs('users');
    let user = allUsers.find((u: any) => u.email?.toLowerCase() === normalizedEmail);

    // Bootstrap initial admin if environment variables are provided in production
    if (!user && process.env.ADMIN_BOOTSTRAP_EMAIL && process.env.ADMIN_BOOTSTRAP_PASSWORD) {
      if (normalizedEmail === process.env.ADMIN_BOOTSTRAP_EMAIL.toLowerCase().trim() && password === process.env.ADMIN_BOOTSTRAP_PASSWORD) {
        const adminId = 'u_admin_bootstrap';
        const salt = await bcrypt.genSalt(12);
        const adminHash = await bcrypt.hash(password, salt);
        user = {
          id: adminId,
          email: normalizedEmail,
          name: 'Primary System Administrator',
          role: 'admin',
          department: 'Executive Office',
          institution: 'Academic Publishing Group',
          passwordHash: adminHash,
          isVerified: true,
          isActive: true,
          mustChangePassword: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await saveCollectionDoc('users', adminId, user);
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, error: 'Your account has been deactivated. Please contact support.' });
    }

    // Verify Password Hash
    let isPasswordValid = false;
    if (user.passwordHash) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    // Update last login timestamp
    user.lastLoginAt = new Date().toISOString();
    await saveCollectionDoc('users', user.id, user);

    // Generate JWT access token & set secure HTTP-only cookie
    const token = AuthService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: Boolean(user.isVerified)
    });

    AuthService.setAuthCookie(res, token);

    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: safeUser,
      token
    });
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ success: false, error: 'Authentication failed. Please try again.' });
  }
});

/**
 * POST /api/auth/logout
 * Clears the HTTP-only auth cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  AuthService.clearAuthCookie(res);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 * Retrieves profile of current authenticated user session
 */
router.get('/me', requireAuth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const user = await getCollectionDocById('users', req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      user: safeUser
    });
  } catch (err: any) {
    console.error('[Auth Me Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve session profile.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Generates secure password reset token
 */
router.post('/forgot-password', getAuthRateLimiter(), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const allUsers = await getCollectionDocs('users');
    const user = allUsers.find((u: any) => u.email?.toLowerCase() === email.toLowerCase().trim());

    // Do not reveal whether user exists for security
    if (user) {
      const resetToken = 'rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour
      await saveCollectionDoc('users', user.id, user);
    }

    return res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.'
    });
  } catch (err: any) {
    console.error('[Forgot Password Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to process password reset request.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Resets user password using valid token
 */
router.post('/reset-password', getAuthRateLimiter(), async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Valid token and password of at least 8 characters required.' });
    }

    const allUsers = await getCollectionDocs('users');
    const user = allUsers.find((u: any) => u.resetPasswordToken === token);

    if (!user || !user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ success: false, error: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.updatedAt = new Date().toISOString();

    await saveCollectionDoc('users', user.id, user);

    return res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
  } catch (err: any) {
    console.error('[Reset Password Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});

export default router;
