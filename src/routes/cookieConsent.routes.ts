import { Router, Request, Response } from 'express';
import { VisitorActivityService } from '../services/visitorActivity.service';

const router = Router();

// GET /api/cookie-consents - Fetch recent consent records
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const consents = await VisitorActivityService.getConsents(limit);
    return res.json(consents);
  } catch (err: any) {
    console.error('Error fetching cookie consents:', err);
    return res.status(500).json({ error: 'Failed to fetch cookie consents', message: err?.message });
  }
});

// POST /api/cookie-consents - Record visitor consent decision
router.post('/', async (req: Request, res: Response) => {
  try {
    const consentData = req.body;
    if (!consentData.userAgent && req.headers['user-agent']) {
      consentData.userAgent = req.headers['user-agent'];
    }
    if (!consentData.ip) {
      consentData.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    }

    const saved = await VisitorActivityService.recordConsent(consentData);
    return res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error recording cookie consent:', err);
    return res.status(500).json({ error: 'Failed to record cookie consent', message: err?.message });
  }
});

// GET /api/cookie-consents/settings - Fetch global cookie settings
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await VisitorActivityService.getCookieSettings();
    return res.json(settings);
  } catch (err: any) {
    console.error('Error fetching cookie settings:', err);
    return res.status(500).json({ error: 'Failed to fetch cookie settings', message: err?.message });
  }
});

// PUT /api/cookie-consents/settings - Update global cookie settings (Admin)
router.put('/settings', async (req: Request, res: Response) => {
  try {
    const updated = await VisitorActivityService.updateCookieSettings(req.body);
    return res.json(updated);
  } catch (err: any) {
    console.error('Error updating cookie settings:', err);
    return res.status(500).json({ error: 'Failed to update cookie settings', message: err?.message });
  }
});

export default router;
