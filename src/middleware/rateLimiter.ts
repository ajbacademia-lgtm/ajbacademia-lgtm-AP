import rateLimit from 'express-rate-limit';

/**
 * Authentication and sensitive endpoints rate limiter
 * Protects against brute-force attacks on login, registration, and password reset
 */
export function getAuthRateLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25, // limit each IP to 25 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
    }
  });
}

/**
 * Upload rate limiter to prevent disk exhaustion
 */
export function getUploadRateLimiter() {
  return rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, // limit each IP to 50 uploads per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Upload rate limit reached. Please wait before uploading more files.'
    }
  });
}
