import { Router, Request, Response } from 'express';
import { LiveChatService } from '../services/liveChat.service';

const router = Router();

// GET /api/live-chats/stats - Aggregated stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await LiveChatService.getAnalyticsSummary();
    return res.json(stats);
  } catch (err: any) {
    console.error('Error getting chat stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve chat metrics', message: err?.message });
  }
});

// GET /api/live-chats/presence - Get current admin presence status
router.get('/presence', async (_req: Request, res: Response) => {
  try {
    const presence = await LiveChatService.getPresence();
    return res.json(presence);
  } catch (err: any) {
    console.error('Error getting presence:', err);
    return res.status(500).json({ error: 'Failed to retrieve presence', message: err?.message });
  }
});

// POST /api/live-chats/presence - Update admin presence
router.post('/presence', async (req: Request, res: Response) => {
  try {
    const { isOnline, statusNote, adminEmail } = req.body;
    const result = await LiveChatService.updatePresence(adminEmail || 'admin@academicpublishinggroup.org', Boolean(isOnline), statusNote);
    return res.json(result);
  } catch (err: any) {
    console.error('Error updating presence:', err);
    return res.status(500).json({ error: 'Failed to update presence', message: err?.message });
  }
});

// GET /api/live-chats - List all sessions
router.get('/', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    const data = await LiveChatService.getSessions({ status, search, limit });
    return res.json(data);
  } catch (err: any) {
    console.error('Error listing chats:', err);
    return res.status(500).json({ error: 'Failed to list chat sessions', message: err?.message });
  }
});

// POST /api/live-chats - Create session from visitor widget
router.post('/', async (req: Request, res: Response) => {
  try {
    const { visitorName, visitorEmail, visitorPhone, initialDescription, pageUrl, pageTitle } = req.body;
    if (!visitorName || !visitorName.trim()) {
      return res.status(400).json({ error: 'Visitor name is required to start a chat.' });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    let browser = 'Chrome';
    const ua = req.headers['user-agent'] || '';
    if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    const result = await LiveChatService.createSession({
      visitorName: visitorName.trim(),
      visitorEmail: visitorEmail?.trim() || '',
      visitorPhone: visitorPhone?.trim() || '',
      initialDescription: initialDescription?.trim() || '',
      pageUrl: pageUrl || '/',
      pageTitle: pageTitle || 'Academic Journal Platform',
      ip,
      browser,
      device: ua.includes('Mobile') ? 'mobile' : 'desktop',
    });

    return res.status(201).json(result);
  } catch (err: any) {
    console.error('Error creating chat session:', err);
    return res.status(500).json({ error: 'Failed to create chat session', message: err?.message });
  }
});

// GET /api/live-chats/:id - Get single session with full message thread
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const session = await LiveChatService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    return res.json(session);
  } catch (err: any) {
    console.error('Error fetching chat session:', err);
    return res.status(500).json({ error: 'Failed to fetch chat session', message: err?.message });
  }
});

// POST /api/live-chats/:id/messages - Send message to session
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { sender, senderName, content, adminEmail } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const message = await LiveChatService.sendMessage(id, {
      sender: sender || 'admin',
      senderName: senderName || (sender === 'admin' ? 'Support Representative' : 'Visitor'),
      content: content.trim(),
      adminEmail,
    });

    return res.status(201).json(message);
  } catch (err: any) {
    console.error('Error sending chat message:', err);
    return res.status(500).json({ error: 'Failed to send message', message: err?.message });
  }
});

// POST /api/live-chats/:id/copilot - Generate AI draft for admin
router.post('/:id/copilot', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { customInstruction } = req.body;
    const draft = await LiveChatService.generateCopilotDraft(id, customInstruction);
    return res.json({ draft });
  } catch (err: any) {
    console.error('Error generating AI copilot draft:', err);
    return res.status(500).json({ error: 'Failed to generate copilot draft', message: err?.message });
  }
});

// POST /api/live-chats/:id/assistant-reply - Generate and save AI reply for visitor chat
router.post('/:id/assistant-reply', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { message } = req.body;
    const reply = await LiveChatService.generateAssistantReply(id, message || '');
    return res.json(reply);
  } catch (err: any) {
    console.error('Error generating assistant reply:', err);
    return res.status(500).json({ error: 'Failed to generate assistant reply', message: err?.message });
  }
});

// PATCH /api/live-chats/:id/status - Update session status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, notes } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await LiveChatService.updateStatus(id, status, notes);
    if (!updated) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error updating status:', err);
    return res.status(500).json({ error: 'Failed to update status', message: err?.message });
  }
});

// POST /api/live-chats/:id/assign - Assign to admin
router.post('/:id/assign', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { adminEmail, adminName } = req.body;
    const updated = await LiveChatService.assignSession(id, adminEmail || 'admin@academicpublishinggroup.org', adminName || 'Academic Admin');
    return res.json(updated);
  } catch (err: any) {
    console.error('Error assigning chat:', err);
    return res.status(500).json({ error: 'Failed to assign chat', message: err?.message });
  }
});

// POST /api/live-chats/:id/read - Mark as read
router.post('/:id/read', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { by } = req.body;
    await LiveChatService.markAsRead(id, by === 'visitor' ? 'visitor' : 'admin');
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Error marking as read:', err);
    return res.status(500).json({ error: 'Failed to mark as read', message: err?.message });
  }
});

// DELETE /api/live-chats/:id - Delete session
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await LiveChatService.deleteSession(id);
    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error('Error deleting chat session:', err);
    return res.status(500).json({ error: 'Failed to delete chat session', message: err?.message });
  }
});

export default router;
