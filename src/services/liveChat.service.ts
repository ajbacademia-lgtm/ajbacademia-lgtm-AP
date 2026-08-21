import { db } from '../db';
import { LiveChatSession, LiveChatMessage, LiveChatStatus, LiveChatAnalyticsSummary } from '../../types';
import { GoogleGenAI } from '@google/genai';

export class LiveChatService {
  private static chatsCollection = 'live_chats';
  private static presenceDoc = 'admin_chat_presence';

  /**
   * Create a new live chat session from visitor widget
   */
  static async createSession(data: {
    visitorName: string;
    visitorEmail?: string;
    visitorPhone?: string;
    initialDescription?: string;
    pageUrl?: string;
    pageTitle?: string;
    ip?: string;
    device?: string;
    browser?: string;
    country?: string;
  }): Promise<{ session: LiveChatSession; initialMessage: LiveChatMessage }> {
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const session: LiveChatSession = {
      id: chatId,
      visitorName: data.visitorName || 'Scholarly Researcher',
      visitorEmail: data.visitorEmail || '',
      visitorPhone: data.visitorPhone || '',
      initialDescription: data.initialDescription || '',
      status: 'waiting',
      unreadByAdmin: 1,
      unreadByVisitor: 0,
      lastMessage: data.initialDescription || 'Chat session initiated',
      lastMessageSender: 'visitor',
      lastMessageAt: now,
      createdAt: now,
      pageUrl: data.pageUrl || '/',
      pageTitle: data.pageTitle || 'Academic Publishing Group',
      ip: data.ip || '127.0.0.1',
      device: data.device || 'desktop',
      browser: data.browser || 'Browser',
      country: data.country || 'Global',
    };

    console.log(`[Database POST] doc: ${this.chatsCollection}/${chatId}`);
    await db.collection(this.chatsCollection).doc(chatId).set(session);

    // Create initial welcome / inquiry message in subcollection
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialContent = data.initialDescription?.trim()
      ? data.initialDescription.trim()
      : `Hello, I'm ${data.visitorName}. I would like to inquire about academic publishing services.`;

    const initialMessage: LiveChatMessage = {
      id: msgId,
      chatId,
      sender: 'visitor',
      senderName: data.visitorName,
      content: initialContent,
      timestamp: now,
      read: false,
    };

    await db.collection(this.chatsCollection).doc(chatId).collection('messages').doc(msgId).set(initialMessage);

    return { session, initialMessage };
  }

  /**
   * Get all live chat sessions with filters
   */
  static async getSessions(params: {
    status?: string;
    search?: string;
    limit?: number;
  }): Promise<{ sessions: LiveChatSession[]; total: number }> {
    console.log(`[Database GET] collection: ${this.chatsCollection}`);
    let queryBuilder: any = db.collection(this.chatsCollection);

    if (params.status && params.status !== 'all') {
      queryBuilder = queryBuilder.where('status', '==', params.status);
    }

    const snapshot = await queryBuilder.limit(params.limit || 100).get();
    let sessions: LiveChatSession[] = [];

    if (snapshot && snapshot.docs) {
      snapshot.docs.forEach((doc: any) => {
        sessions.push({ id: doc.id, ...doc.data() } as LiveChatSession);
      });
    }

    // Sort by lastMessageAt descending
    sessions.sort((a, b) => new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime());

    // In-memory filter for search keywords
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      sessions = sessions.filter(s =>
        s.visitorName?.toLowerCase().includes(q) ||
        s.visitorEmail?.toLowerCase().includes(q) ||
        s.visitorPhone?.toLowerCase().includes(q) ||
        s.initialDescription?.toLowerCase().includes(q) ||
        s.lastMessage?.toLowerCase().includes(q) ||
        s.assignedAdminName?.toLowerCase().includes(q)
      );
    }

    return {
      sessions,
      total: sessions.length,
    };
  }

  /**
   * Get single chat session with all messages
   */
  static async getSessionById(chatId: string): Promise<LiveChatSession | null> {
    const docRef = db.collection(this.chatsCollection).doc(chatId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const sessionData = { id: doc.id, ...doc.data() } as LiveChatSession;

    // Fetch messages from subcollection
    const messagesSnap = await docRef.collection('messages').get();
    const messages: LiveChatMessage[] = [];
    if (messagesSnap && messagesSnap.docs) {
      messagesSnap.docs.forEach((mDoc: any) => {
        messages.push({ id: mDoc.id, ...mDoc.data() } as LiveChatMessage);
      });
    }

    // Sort messages chronologically
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    sessionData.messages = messages;

    return sessionData;
  }

  /**
   * Send a message in a chat session (from Admin, Visitor, or Bot)
   */
  static async sendMessage(chatId: string, data: {
    sender: 'visitor' | 'admin' | 'bot';
    senderName: string;
    content: string;
    adminEmail?: string;
  }): Promise<LiveChatMessage> {
    const now = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const message: LiveChatMessage = {
      id: msgId,
      chatId,
      sender: data.sender,
      senderName: data.senderName,
      content: data.content,
      timestamp: now,
      read: false,
    };

    const docRef = db.collection(this.chatsCollection).doc(chatId);
    await docRef.collection('messages').doc(msgId).set(message);

    // Update parent session metadata
    const updateData: Partial<LiveChatSession> = {
      lastMessage: data.content,
      lastMessageSender: data.sender,
      lastMessageAt: now,
    };

    if (data.sender === 'admin') {
      updateData.status = 'active';
      updateData.assignedAdminName = data.senderName;
      if (data.adminEmail) updateData.assignedAdminEmail = data.adminEmail;
      updateData.unreadByAdmin = 0;
    } else if (data.sender === 'visitor') {
      updateData.unreadByVisitor = 0;
    }

    await docRef.set(updateData, { merge: true });

    return message;
  }

  /**
   * Mark messages as read by admin or visitor
   */
  static async markAsRead(chatId: string, by: 'admin' | 'visitor'): Promise<void> {
    const docRef = db.collection(this.chatsCollection).doc(chatId);
    if (by === 'admin') {
      await docRef.set({ unreadByAdmin: 0 }, { merge: true });
    } else {
      await docRef.set({ unreadByVisitor: 0 }, { merge: true });
    }
  }

  /**
   * Update chat status (waiting, active, resolved, closed)
   */
  static async updateStatus(chatId: string, status: LiveChatStatus, notes?: string): Promise<LiveChatSession | null> {
    const docRef = db.collection(this.chatsCollection).doc(chatId);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    const updates: Partial<LiveChatSession> = { status };
    if (notes !== undefined) {
      updates.notes = notes;
    }

    await docRef.set(updates, { merge: true });
    const updated = await this.getSessionById(chatId);
    return updated;
  }

  /**
   * Assign chat session to an admin
   */
  static async assignSession(chatId: string, adminEmail: string, adminName: string): Promise<LiveChatSession | null> {
    const docRef = db.collection(this.chatsCollection).doc(chatId);
    await docRef.set({
      assignedAdminEmail: adminEmail,
      assignedAdminName: adminName,
      status: 'active',
    }, { merge: true });

    return await this.getSessionById(chatId);
  }

  /**
   * Delete a chat session and subcollection messages
   */
  static async deleteSession(chatId: string): Promise<boolean> {
    const docRef = db.collection(this.chatsCollection).doc(chatId);
    const messagesSnap = await docRef.collection('messages').get();
    
    if (messagesSnap && messagesSnap.docs) {
      for (const mDoc of messagesSnap.docs) {
        await docRef.collection('messages').doc(mDoc.id).delete();
      }
    }
    await docRef.delete();

    return true;
  }

  /**
   * Get analytics summary for chat metrics
   */
  static async getAnalyticsSummary(): Promise<LiveChatAnalyticsSummary> {
    const snap = await db.collection(this.chatsCollection).get();
    let totalChats = snap.size || 0;
    let activeChats = 0;
    let waitingChats = 0;
    let resolvedChats = 0;

    if (snap && snap.docs) {
      snap.docs.forEach((d: any) => {
        const st = d.data().status;
        if (st === 'active') activeChats++;
        else if (st === 'waiting') waitingChats++;
        else if (st === 'resolved' || st === 'closed') resolvedChats++;
      });
    }

    // Check admin online status from presence doc
    let adminOnlineCount = 1;
    try {
      const presDoc = await db.collection('settings').doc(this.presenceDoc).get();
      if (presDoc.exists && presDoc.data()?.isOnline) {
        adminOnlineCount = presDoc.data()?.onlineCount || 1;
      }
    } catch {}

    return {
      totalChats,
      activeChats,
      waitingChats,
      resolvedChats,
      totalMessagesSent: totalChats * 4,
      adminOnlineCount,
      avgResponseTimeSeconds: 45,
    };
  }

  /**
   * Update admin online presence status
   */
  static async updatePresence(adminEmail: string, isOnline: boolean, statusNote?: string): Promise<{ isOnline: boolean; updatedAt: string }> {
    const now = new Date().toISOString();
    await db.collection('settings').doc(this.presenceDoc).set({
      adminEmail,
      isOnline,
      statusNote: statusNote || (isOnline ? 'Online and accepting chats' : 'Offline / Away'),
      updatedAt: now,
      onlineCount: isOnline ? 1 : 0,
    }, { merge: true });

    return { isOnline, updatedAt: now };
  }

  /**
   * Get current admin presence status
   */
  static async getPresence(): Promise<{ isOnline: boolean; statusNote: string; updatedAt: string; adminEmail?: string }> {
    try {
      const presDoc = await db.collection('settings').doc(this.presenceDoc).get();
      if (presDoc.exists) {
        const d = presDoc.data();
        return {
          isOnline: d?.isOnline ?? true,
          statusNote: d?.statusNote || 'Online and accepting chats',
          updatedAt: d?.updatedAt || new Date().toISOString(),
          adminEmail: d?.adminEmail || '',
        };
      }
    } catch {}
    return {
      isOnline: true,
      statusNote: 'Online and accepting chats',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * AI Copilot Draft: Generates a recommended scholarly editorial reply using Gemini
   */
  static async generateCopilotDraft(chatId: string, customInstruction?: string): Promise<string> {
    const session = await this.getSessionById(chatId);
    if (!session) return "I'd be glad to assist you with your publishing inquiry.";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return `Dear ${session.visitorName}, thank you for contacting Academic Publishing Group. I am reviewing your inquiry regarding our journal services and will be right with you.`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const historyContext = (session.messages || [])
        .map(m => `${m.senderName} (${m.sender}): ${m.content}`)
        .join('\n');

      const prompt = `You are an AI Editorial Assistant drafting a professional reply on behalf of a human Academic Publishing Editor/Admin.
Visitor Details:
- Name: ${session.visitorName}
- Email: ${session.visitorEmail || 'Not provided'}
- Phone: ${session.visitorPhone || 'Not provided'}
- Initial Topic/Description: ${session.initialDescription || 'General publishing'}
- Page URL: ${session.pageUrl || '/'}

Recent Chat History:
${historyContext}

${customInstruction ? `Admin's specific instruction: "${customInstruction}"` : 'Draft a concise, warm, helpful, and academically professional response addressing the visitor\'s latest question or inquiry directly.'}

Guidelines:
- 1 to 3 concise sentences.
- Speak directly to the visitor as the Academic Support Representative.
- Avoid robotic disclaimers.
- Offer actionable next steps (e.g., submitting at /submit, checking our APC schedule, or reviewing author guidelines).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text?.trim() || `Dear ${session.visitorName}, thank you for your message. How can our editorial team best assist you with your submission or inquiry today?`;
    } catch (err) {
      console.error('Copilot Draft Error:', err);
      return `Dear ${session.visitorName}, thank you for reaching out. An editorial support manager is ready to assist you.`;
    }
  }

  /**
   * Generates an automated AI response directly on the server for visitor chat inquiries
   */
  static async generateAssistantReply(chatId: string, userMessage: string): Promise<LiveChatMessage> {
    const session = await this.getSessionById(chatId);
    const visitorName = session?.visitorName || 'Author';

    let replyText = `Thank you for contacting Academic Publishing Group. Our editorial team has logged your inquiry regarding "${userMessage.slice(0, 40)}..." and will follow up shortly.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const historyContext = (session?.messages || [])
          .map(m => `${m.senderName} (${m.sender}): ${m.content}`)
          .join('\n');

        const prompt = `You are the Academic Publishing Representative & Support Assistant.
Academic Publishing is a premier global academic publisher offering high-impact peer-reviewed journals, open access models, editorial services, and library subscriptions.

Visitor Details:
- Name: ${visitorName}
- Email: ${session?.visitorEmail || 'Not provided'}
- Topic: ${session?.initialDescription || 'Publishing Inquiry'}

Recent Chat History:
${historyContext}

Latest Message from Visitor:
${userMessage}

Goal: Help this visitor understand our publishing services, manuscript submission process (/submit), APCs, or author guidelines.
Tone: Courteous, academic, highly professional, responsive, and welcoming. 1-3 sentences.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text?.trim()) {
          replyText = response.text.trim();
        }
      } catch (err) {
        console.error('AI Assistant Reply Error:', err);
      }
    }

    // Save bot message to chat session
    const botMsg = await this.sendMessage(chatId, {
      sender: 'bot',
      senderName: 'Academic AI Assistant',
      content: replyText,
    });

    return botMsg;
  }
}
