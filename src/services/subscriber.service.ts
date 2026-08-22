import { db } from '../db';
import { 
  NewsletterSubscriber, 
  SubscriberStatus, 
  NewsletterFrequency, 
  NewsletterCampaign, 
  NewsletterAnalyticsSummary 
} from '../../types';

export class SubscriberService {
  private static subscribersCollection = 'subscribers';
  private static campaignsCollection = 'newsletter_campaigns';
  private static hasCheckedSeed = false;

  /**
   * Seed realistic sample subscribers and campaigns if collection is completely empty
   */
  private static async seedInitialDataIfEmpty(): Promise<void> {
    if (this.hasCheckedSeed) return;
    this.hasCheckedSeed = true;

    if (process.env.NODE_ENV === 'production') {
      return; // Never seed demo newsletter subscribers in production
    }

    try {
      const snap = await db.collection(this.subscribersCollection).limit(1).get();
      if (!snap.empty) return;

      const sampleSubscribers: NewsletterSubscriber[] = [
        {
          id: 'sub_001_oxford',
          email: 'e.turner@oxford.ac.uk',
          name: 'Prof. Eleanor Turner',
          institution: 'University of Oxford',
          country: 'United Kingdom',
          status: 'Active',
          frequency: 'Weekly',
          topics: ['Medicine & Healthcare', 'Life Sciences & Biology'],
          subscribedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Website Newsletter Section',
          notes: 'Senior Reviewer in Biomedical Therapeutics',
          unsubscribeToken: 'unsub_oxf_001_token'
        },
        {
          id: 'sub_002_mit',
          email: 'j.martinez@csail.mit.edu',
          name: 'Dr. Javier Martinez',
          institution: 'MIT CSAIL',
          country: 'United States',
          status: 'Active',
          frequency: 'Weekly',
          topics: ['Computer Science & AI', 'Engineering & Tech'],
          subscribedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Dedicated Newsletter Page',
          notes: 'Keynote Author in Neural Architectures',
          unsubscribeToken: 'unsub_mit_002_token'
        },
        {
          id: 'sub_003_cambridge',
          email: 'a.baker@cam.ac.uk',
          name: 'Dr. Arthur Baker',
          institution: 'University of Cambridge',
          country: 'United Kingdom',
          status: 'Active',
          frequency: 'Monthly',
          topics: ['Engineering & Tech', 'Social Sciences & Humanities'],
          subscribedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Article Footer Link',
          unsubscribeToken: 'unsub_cam_003_token'
        },
        {
          id: 'sub_004_tokyo',
          email: 'h.tanaka@u-tokyo.ac.jp',
          name: 'Prof. Hiroshi Tanaka',
          institution: 'University of Tokyo',
          country: 'Japan',
          status: 'Active',
          frequency: 'Breaking Alerts',
          topics: ['All Disciplines & Research Updates'],
          subscribedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Website Newsletter Section',
          unsubscribeToken: 'unsub_tky_004_token'
        },
        {
          id: 'sub_005_eth',
          email: 'claudia.vogel@ethz.ch',
          name: 'Dr. Claudia Vogel',
          institution: 'ETH Zurich',
          country: 'Switzerland',
          status: 'Active',
          frequency: 'Weekly',
          topics: ['Life Sciences & Biology', 'Medicine & Healthcare'],
          subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Home Page Section',
          unsubscribeToken: 'unsub_eth_005_token'
        },
        {
          id: 'sub_006_toronto',
          email: 'sarah.chen@utoronto.ca',
          name: 'Dr. Sarah Chen',
          institution: 'University of Toronto',
          country: 'Canada',
          status: 'Active',
          frequency: 'Monthly',
          topics: ['Business & Economics', 'Social Sciences & Humanities'],
          subscribedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Home Page Section',
          unsubscribeToken: 'unsub_tor_006_token'
        },
        {
          id: 'sub_007_unsub',
          email: 'd.ross@stanford.edu',
          name: 'David Ross',
          institution: 'Stanford University',
          country: 'United States',
          status: 'Unsubscribed',
          frequency: 'Weekly',
          topics: ['Computer Science & AI'],
          subscribedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Admin Manual Entry',
          notes: 'Requested pause during sabbatical',
          unsubscribeToken: 'unsub_stf_007_token'
        }
      ];

      await Promise.all(sampleSubscribers.map(s => {
        const ref = db.collection(this.subscribersCollection).doc(s.id);
        return ref.set(s);
      }));

      // Also seed an initial sample campaign
      const sampleCampaign: NewsletterCampaign = {
        id: 'camp_001_welcome_digest',
        subject: 'Academic Publishing Group: Q3 Research Highlights & Special Issue Call for Papers',
        previewText: 'Discover groundbreaking open-access discoveries in neural computation, clinical oncology, and sustainable energy.',
        content: 'Dear Colleagues and Researchers,\n\nWe are pleased to present the latest research digest from the Academic Publishing Group. In this issue:\n- Advances in Deep Generative Models for Molecular Simulation\n- Open Access Mandates: Global Compliance Insights\n- Call for Papers: Special Issue on Quantum Machine Learning (Submission Deadline: Nov 30)\n\nThank you for being part of our global scholarly community.',
        targetTopics: ['all'],
        targetFrequency: 'All',
        status: 'Sent',
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        recipientCount: 6,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'Editorial Board'
      };
      await db.collection(this.campaignsCollection).doc(sampleCampaign.id).set(sampleCampaign);
      console.log('Seeded initial sample newsletter subscribers and campaigns into database.');
    } catch (err) {
      console.warn('Initial subscriber seed skipped or failed non-critically:', err);
    }
  }

  /**
   * Subscribe a new or returning user to the newsletter
   */
  static async subscribe(data: {
    email: string;
    name?: string;
    institution?: string;
    country?: string;
    frequency?: NewsletterFrequency;
    topics?: string[];
    source?: string;
    notes?: string;
  }): Promise<{ subscriber: NewsletterSubscriber; isNew: boolean; statusMessage: string }> {
    const rawEmail = (data.email || '').trim().toLowerCase();
    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    const defaultTopics = data.topics && data.topics.length > 0 
      ? data.topics 
      : ['All Disciplines & Research Updates'];
    const frequency = data.frequency || 'Weekly';
    const source = data.source || 'Website Subscription Section';
    const now = new Date().toISOString();

    // Check if subscriber already exists by email query
    const snapshot = await db.collection(this.subscribersCollection)
      .where('email', '==', rawEmail)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const existingData = doc.data() as NewsletterSubscriber;
      
      const wasActive = existingData.status === 'Active';
      const updatedTopics = Array.from(new Set([...(existingData.topics || []), ...defaultTopics]));
      
      const updatedSubscriber: NewsletterSubscriber = {
        ...existingData,
        name: data.name?.trim() || existingData.name || '',
        institution: data.institution?.trim() || existingData.institution || '',
        country: data.country || existingData.country || '',
        topics: updatedTopics,
        frequency: data.frequency || existingData.frequency || 'Weekly',
        status: 'Active',
        source: existingData.source || source,
        updatedAt: now,
      };

      await db.collection(this.subscribersCollection).doc(doc.id).set(updatedSubscriber, { merge: true });

      return {
        subscriber: updatedSubscriber,
        isNew: false,
        statusMessage: wasActive 
          ? 'Your newsletter subscription preferences have been updated successfully!' 
          : 'Welcome back! Your subscription has been reactivated successfully.'
      };
    }

    // Create new subscriber
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const unsubscribeToken = `unsub_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;

    const newSubscriber: NewsletterSubscriber = {
      id,
      email: rawEmail,
      name: data.name?.trim() || '',
      institution: data.institution?.trim() || '',
      country: data.country || '',
      status: 'Active',
      frequency,
      topics: defaultTopics,
      subscribedAt: now,
      updatedAt: now,
      source,
      notes: data.notes || '',
      unsubscribeToken,
    };

    await db.collection(this.subscribersCollection).doc(id).set(newSubscriber);

    return {
      subscriber: newSubscriber,
      isNew: true,
      statusMessage: 'Thank you for subscribing! You will receive our latest academic publishing updates and journal highlights.'
    };
  }

  /**
   * Unsubscribe a subscriber using their email or unsubscribeToken
   */
  static async unsubscribe(identifier: string): Promise<{ success: boolean; message: string }> {
    const raw = (identifier || '').trim();
    if (!raw) {
      throw new Error('Missing email or unsubscribe token.');
    }

    let targetDocId: string | null = null;
    let currentData: NewsletterSubscriber | null = null;

    if (raw.includes('@')) {
      const snap = await db.collection(this.subscribersCollection)
        .where('email', '==', raw.toLowerCase())
        .limit(1)
        .get();
      if (!snap.empty && snap.docs[0]) {
        targetDocId = snap.docs[0].id;
        currentData = snap.docs[0].data() as NewsletterSubscriber;
      }
    } else {
      const snap = await db.collection(this.subscribersCollection)
        .where('unsubscribeToken', '==', raw)
        .limit(1)
        .get();
      if (!snap.empty && snap.docs[0]) {
        targetDocId = snap.docs[0].id;
        currentData = snap.docs[0].data() as NewsletterSubscriber;
      }
    }

    if (!targetDocId || !currentData) {
      throw new Error('No subscriber found matching the provided details.');
    }

    const now = new Date().toISOString();
    await db.collection(this.subscribersCollection).doc(targetDocId).update({
      status: 'Unsubscribed',
      updatedAt: now
    });

    return {
      success: true,
      message: 'You have been successfully unsubscribed from Academic Publishing Group newsletters.'
    };
  }

  /**
   * Get all subscribers with optional filtering and search
   */
  static async getSubscribers(filter?: {
    status?: string;
    topic?: string;
    frequency?: string;
    search?: string;
  }): Promise<NewsletterSubscriber[]> {
    await this.seedInitialDataIfEmpty();
    let query: any = db.collection(this.subscribersCollection);

    if (filter?.status && filter.status !== 'All') {
      query = query.where('status', '==', filter.status);
    }
    if (filter?.frequency && filter.frequency !== 'All') {
      query = query.where('frequency', '==', filter.frequency);
    }

    const snap = await query.get();
    let subscribers: NewsletterSubscriber[] = snap.docs.map((d: any) => ({
      id: d.id,
      ...(d.data() as Omit<NewsletterSubscriber, 'id'>)
    }));

    // In-memory filters for flexible multi-topic & search
    if (filter?.topic && filter.topic !== 'All' && filter.topic !== 'all') {
      subscribers = subscribers.filter(s => 
        s.topics && s.topics.some(t => t.toLowerCase().includes(filter.topic!.toLowerCase()))
      );
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      subscribers = subscribers.filter(s => 
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.institution && s.institution.toLowerCase().includes(q)) ||
        (s.source && s.source.toLowerCase().includes(q))
      );
    }

    // Sort by subscribedAt descending (newest first)
    subscribers.sort((a, b) => {
      const dateA = new Date(a.subscribedAt || 0).getTime();
      const dateB = new Date(b.subscribedAt || 0).getTime();
      return dateB - dateA;
    });

    return subscribers;
  }

  /**
   * Get single subscriber by ID
   */
  static async getSubscriberById(id: string): Promise<NewsletterSubscriber | null> {
    const doc = await db.collection(this.subscribersCollection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...(doc.data() as Omit<NewsletterSubscriber, 'id'>) };
  }

  /**
   * Create subscriber manually from Admin Console
   */
  static async createSubscriber(data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
    const email = (data.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Valid email address is required.');
    }

    const existingSnap = await db.collection(this.subscribersCollection)
      .where('email', '==', email)
      .limit(1)
      .get();
    if (!existingSnap.empty) {
      throw new Error(`A subscriber with email "${email}" already exists.`);
    }

    const id = data.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const token = `unsub_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;

    const newSub: NewsletterSubscriber = {
      id,
      email,
      name: data.name?.trim() || '',
      institution: data.institution?.trim() || '',
      country: data.country || '',
      status: data.status || 'Active',
      frequency: data.frequency || 'Weekly',
      topics: data.topics && data.topics.length > 0 ? data.topics : ['All Disciplines & Research Updates'],
      subscribedAt: data.subscribedAt || now,
      updatedAt: now,
      source: data.source || 'Admin Console',
      notes: data.notes || '',
      unsubscribeToken: token,
    };

    await db.collection(this.subscribersCollection).doc(id).set(newSub);
    return newSub;
  }

  /**
   * Update an existing subscriber
   */
  static async updateSubscriber(id: string, updates: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
    const docRef = db.collection(this.subscribersCollection).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      throw new Error(`Subscriber with ID ${id} not found.`);
    }

    const now = new Date().toISOString();
    const cleanUpdates = {
      ...updates,
      updatedAt: now,
    };

    // If email is changing, ensure no duplicate
    if (updates.email) {
      const email = updates.email.trim().toLowerCase();
      const duplicateSnap = await db.collection(this.subscribersCollection)
        .where('email', '==', email)
        .limit(1)
        .get();
      if (!duplicateSnap.empty && duplicateSnap.docs[0].id !== id) {
        throw new Error(`Another subscriber with email "${email}" already exists.`);
      }
      cleanUpdates.email = email;
    }

    await docRef.set(cleanUpdates, { merge: true });
    const updated = await docRef.get();
    return { id: updated.id, ...(updated.data() as Omit<NewsletterSubscriber, 'id'>) };
  }

  /**
   * Delete a subscriber
   */
  static async deleteSubscriber(id: string): Promise<boolean> {
    await db.collection(this.subscribersCollection).doc(id).delete();
    return true;
  }

  /**
   * Bulk update status for multiple subscriber IDs
   */
  static async bulkUpdateStatus(ids: string[], status: SubscriberStatus): Promise<{ updatedCount: number }> {
    if (!ids || ids.length === 0) return { updatedCount: 0 };
    const now = new Date().toISOString();

    await Promise.all(ids.map(id => {
      const ref = db.collection(this.subscribersCollection).doc(id);
      return ref.update({ status, updatedAt: now });
    }));

    return { updatedCount: ids.length };
  }

  /**
   * Bulk delete subscribers
   */
  static async bulkDelete(ids: string[]): Promise<{ deletedCount: number }> {
    if (!ids || ids.length === 0) return { deletedCount: 0 };

    await Promise.all(ids.map(id => {
      const ref = db.collection(this.subscribersCollection).doc(id);
      return ref.delete();
    }));

    return { deletedCount: ids.length };
  }

  /**
   * Calculate analytical metrics for subscriber dashboard
   */
  static async getAnalyticsSummary(): Promise<NewsletterAnalyticsSummary> {
    await this.seedInitialDataIfEmpty();
    const snap = await db.collection(this.subscribersCollection).get();
    const subscribers: NewsletterSubscriber[] = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<NewsletterSubscriber, 'id'>)
    }));

    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => s.status === 'Active').length;
    const unsubscribedCount = subscribers.filter(s => s.status === 'Unsubscribed').length;
    const pendingCount = subscribers.filter(s => s.status === 'Pending').length;

    // Calculate new this month
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // YYYY-MM
    const newThisMonth = subscribers.filter(s => (s.subscribedAt || '').startsWith(currentMonthPrefix)).length;
    const growthRatePercent = totalSubscribers > 0 
      ? Math.round((newThisMonth / Math.max(1, totalSubscribers - newThisMonth)) * 100)
      : 0;

    // Topic breakdown
    const topicMap: { [topic: string]: number } = {};
    subscribers.forEach(s => {
      if (s.status === 'Active' && s.topics) {
        s.topics.forEach(t => {
          topicMap[t] = (topicMap[t] || 0) + 1;
        });
      }
    });
    const topicBreakdown = Object.entries(topicMap)
      .map(([topic, count]) => ({
        topic,
        count,
        percentage: activeSubscribers > 0 ? Math.round((count / activeSubscribers) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Frequency breakdown
    const freqMap: { [freq: string]: number } = {};
    subscribers.forEach(s => {
      if (s.status === 'Active') {
        const f = s.frequency || 'Weekly';
        freqMap[f] = (freqMap[f] || 0) + 1;
      }
    });
    const frequencyBreakdown = Object.entries(freqMap)
      .map(([frequency, count]) => ({
        frequency,
        count,
        percentage: activeSubscribers > 0 ? Math.round((count / activeSubscribers) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Source breakdown
    const sourceMap: { [source: string]: number } = {};
    subscribers.forEach(s => {
      const src = s.source || 'Website Footer';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const sourceBreakdown = Object.entries(sourceMap)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalSubscribers > 0 ? Math.round((count / totalSubscribers) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Recent 10 subscribers
    const recentSubscribers = [...subscribers]
      .sort((a, b) => new Date(b.subscribedAt || 0).getTime() - new Date(a.subscribedAt || 0).getTime())
      .slice(0, 10);

    // Campaign count
    const campSnap = await db.collection(this.campaignsCollection).get();
    const totalCampaignsSent = campSnap.docs.filter(d => (d.data() as NewsletterCampaign).status === 'Sent').length;

    return {
      totalSubscribers,
      activeSubscribers,
      unsubscribedCount,
      pendingCount,
      growthRatePercent,
      newThisMonth,
      topicBreakdown,
      frequencyBreakdown,
      sourceBreakdown,
      recentSubscribers,
      totalCampaignsSent
    };
  }

  /**
   * Broadcast a newsletter campaign / digest
   */
  static async sendBroadcastCampaign(data: {
    subject: string;
    previewText?: string;
    content: string;
    targetTopics?: string[];
    targetFrequency?: string;
    createdBy?: string;
  }): Promise<NewsletterCampaign> {
    if (!data.subject?.trim()) throw new Error('Campaign subject line is required.');
    if (!data.content?.trim()) throw new Error('Campaign content body is required.');

    const targetTopics = data.targetTopics && data.targetTopics.length > 0 ? data.targetTopics : ['all'];
    const now = new Date().toISOString();

    // Query active subscribers targeted by this campaign
    let activeSubs = await this.getSubscribers({ status: 'Active' });
    if (!targetTopics.includes('all') && !targetTopics.includes('All Disciplines & Research Updates')) {
      activeSubs = activeSubs.filter(s => 
        s.topics && s.topics.some(t => targetTopics.includes(t))
      );
    }
    if (data.targetFrequency && data.targetFrequency !== 'All') {
      activeSubs = activeSubs.filter(s => s.frequency === data.targetFrequency);
    }

    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const campaign: NewsletterCampaign = {
      id: campaignId,
      subject: data.subject.trim(),
      previewText: data.previewText?.trim() || '',
      content: data.content.trim(),
      targetTopics,
      targetFrequency: data.targetFrequency || 'All',
      status: 'Sent',
      sentAt: now,
      recipientCount: activeSubs.length,
      createdAt: now,
      createdBy: data.createdBy || 'Editorial Board Admin',
    };

    await db.collection(this.campaignsCollection).doc(campaignId).set(campaign);

    // Update lastEmailSentAt for recipients
    if (activeSubs.length > 0) {
      await Promise.all(activeSubs.slice(0, 100).map(sub => {
        const ref = db.collection(this.subscribersCollection).doc(sub.id);
        return ref.update({ lastEmailSentAt: now });
      }));
    }

    return campaign;
  }

  /**
   * Get past broadcast campaigns
   */
  static async getCampaigns(): Promise<NewsletterCampaign[]> {
    await this.seedInitialDataIfEmpty();
    const snap = await db.collection(this.campaignsCollection).get();
    const campaigns: NewsletterCampaign[] = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<NewsletterCampaign, 'id'>)
    }));

    campaigns.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return campaigns;
  }
}
