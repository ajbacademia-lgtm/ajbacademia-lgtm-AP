import { Router, Request, Response } from 'express';
import { VisitorActivityService } from '../services/visitorActivity.service';

const router = Router();

// GET /api/visitor-activities/stats - Get aggregated analytics metrics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const summary = await VisitorActivityService.getAnalyticsSummary();
    return res.json(summary);
  } catch (err: any) {
    console.error('Error fetching visitor stats:', err);
    return res.status(500).json({ error: 'Failed to compute visitor statistics', message: err?.message });
  }
});

// GET /api/visitor-activities - Get filtered activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const actionType = (req.query.actionType as string) || undefined;
    const startDate = (req.query.startDate as string) || undefined;
    const endDate = (req.query.endDate as string) || undefined;
    const search = (req.query.search as string) || undefined;

    const data = await VisitorActivityService.getActivities({
      limit,
      actionType,
      startDate,
      endDate,
      search
    });

    return res.json(data);
  } catch (err: any) {
    console.error('Error fetching visitor activities:', err);
    return res.status(500).json({ error: 'Failed to fetch visitor activities', message: err?.message });
  }
});

// POST /api/visitor-activities - Record single visitor event
router.post('/', async (req: Request, res: Response) => {
  try {
    const activityData = req.body;
    
    // Fallback IP and user-agent from request if missing
    if (!activityData.ip) {
      activityData.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    }
    if (!activityData.browser && req.headers['user-agent']) {
      const ua = req.headers['user-agent'];
      if (ua.includes('Chrome')) activityData.browser = 'Chrome';
      else if (ua.includes('Safari')) activityData.browser = 'Safari';
      else if (ua.includes('Firefox')) activityData.browser = 'Firefox';
      else if (ua.includes('Edge')) activityData.browser = 'Edge';
      else activityData.browser = 'Other Browser';
    }

    const recorded = await VisitorActivityService.recordActivity(activityData);
    return res.status(201).json(recorded);
  } catch (err: any) {
    console.error('Error recording visitor activity:', err);
    return res.status(500).json({ error: 'Failed to record visitor activity', message: err?.message });
  }
});

// DELETE /api/visitor-activities/clear - Clear activities (Admin)
router.delete('/clear', async (_req: Request, res: Response) => {
  try {
    await VisitorActivityService.clearActivities();
    return res.json({ success: true, message: 'All visitor activity records cleared.' });
  } catch (err: any) {
    console.error('Error clearing visitor activities:', err);
    return res.status(500).json({ error: 'Failed to clear activities', message: err?.message });
  }
});

export default router;
