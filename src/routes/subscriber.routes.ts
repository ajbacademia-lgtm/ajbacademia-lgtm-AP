import { Router, Request, Response } from 'express';
import { SubscriberService } from '../services/subscriber.service';

const router = Router();

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * POST /api/subscribers
 * Public subscription endpoint
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, institution, country, frequency, topics, source, notes } = req.body;
    const result = await SubscriberService.subscribe({
      email,
      name,
      institution,
      country,
      frequency,
      topics,
      source,
      notes,
    });
    return res.status(200).json({
      success: true,
      message: result.statusMessage,
      subscriber: result.subscriber,
      isNew: result.isNew,
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to process subscription',
    });
  }
});

/**
 * POST /api/subscribers/unsubscribe
 * Public unsubscription endpoint
 */
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;
    const identifier = token || email;
    const result = await SubscriberService.unsubscribe(identifier);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to unsubscribe',
    });
  }
});

// ==========================================
// ADMIN DASHBOARD ENDPOINTS
// ==========================================

/**
 * GET /api/subscribers
 * Get filtered/searched list of subscribers
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, topic, frequency, search } = req.query;
    const subscribers = await SubscriberService.getSubscribers({
      status: status as string,
      topic: topic as string,
      frequency: frequency as string,
      search: search as string,
    });
    return res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error: any) {
    console.error('Get subscribers error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch subscribers',
    });
  }
});

/**
 * GET /api/subscribers/stats (or /analytics)
 * Get high-level analytics and breakdown
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await SubscriberService.getAnalyticsSummary();
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Get subscriber stats error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate newsletter analytics',
    });
  }
});

router.get('/analytics', async (_req: Request, res: Response) => {
  try {
    const stats = await SubscriberService.getAnalyticsSummary();
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Get subscriber analytics error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate newsletter analytics',
    });
  }
});

/**
 * POST /api/subscribers/admin-create
 * Add subscriber manually from Admin Console
 */
router.post('/admin-create', async (req: Request, res: Response) => {
  try {
    const subscriber = await SubscriberService.createSubscriber(req.body);
    return res.status(201).json({
      success: true,
      message: 'Subscriber created successfully',
      subscriber,
    });
  } catch (error: any) {
    console.error('Admin create subscriber error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create subscriber',
    });
  }
});

/**
 * GET /api/subscribers/:id
 * Get single subscriber
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const subscriberId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const subscriber = await SubscriberService.getSubscriberById(subscriberId);
    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    return res.status(200).json({ success: true, subscriber });
  } catch (error: any) {
    console.error('Get subscriber by id error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get subscriber',
    });
  }
});

/**
 * PUT /api/subscribers/:id
 * Update subscriber
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const subscriberId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await SubscriberService.updateSubscriber(subscriberId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Subscriber updated successfully',
      subscriber: updated,
    });
  } catch (error: any) {
    console.error('Update subscriber error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to update subscriber',
    });
  }
});

/**
 * DELETE /api/subscribers/:id
 * Delete subscriber
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const subscriberId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await SubscriberService.deleteSubscriber(subscriberId);
    return res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete subscriber error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete subscriber',
    });
  }
});

/**
 * POST /api/subscribers/bulk-status
 * Bulk update status
 */
router.post('/bulk-status', async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of subscriber IDs is required' });
    }
    const result = await SubscriberService.bulkUpdateStatus(ids, status);
    return res.status(200).json({
      success: true,
      message: `Successfully updated status for ${result.updatedCount} subscribers`,
      ...result,
    });
  } catch (error: any) {
    console.error('Bulk update status error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update subscriber statuses',
    });
  }
});

/**
 * POST /api/subscribers/bulk-delete
 * Bulk delete subscribers
 */
router.post('/bulk-delete', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of subscriber IDs is required' });
    }
    const result = await SubscriberService.bulkDelete(ids);
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} subscribers`,
      ...result,
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete subscribers',
    });
  }
});

/**
 * POST /api/subscribers/campaigns/broadcast
 * Send/Record broadcast campaign
 */
router.post('/campaigns/broadcast', async (req: Request, res: Response) => {
  try {
    const { subject, previewText, content, targetTopics, targetFrequency, createdBy } = req.body;
    const campaign = await SubscriberService.sendBroadcastCampaign({
      subject,
      previewText,
      content,
      targetTopics,
      targetFrequency,
      createdBy,
    });
    return res.status(201).json({
      success: true,
      message: `Newsletter campaign broadcast successfully to ${campaign.recipientCount} active subscribers!`,
      campaign,
    });
  } catch (error: any) {
    console.error('Broadcast campaign error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to broadcast newsletter campaign',
    });
  }
});

/**
 * GET /api/subscribers/campaigns
 * Get past campaigns
 */
router.get('/campaigns/history', async (_req: Request, res: Response) => {
  try {
    const campaigns = await SubscriberService.getCampaigns();
    return res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch campaigns',
    });
  }
});

export default router;
