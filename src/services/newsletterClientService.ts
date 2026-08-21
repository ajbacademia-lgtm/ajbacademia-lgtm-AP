import { 
  NewsletterSubscriber, 
  SubscriberStatus, 
  NewsletterFrequency, 
  NewsletterAnalyticsSummary, 
  NewsletterCampaign 
} from '../../types';
import { safeFetchJson } from '../utils/safeApi';

export class NewsletterClientService {
  /**
   * Public subscribe method
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
  }): Promise<{ success: boolean; message: string; subscriber?: NewsletterSubscriber; isNew?: boolean }> {
    try {
      return await safeFetchJson('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err: any) {
      console.error('NewsletterClientService.subscribe error:', err);
      throw err;
    }
  }

  /**
   * Public unsubscribe method
   */
  static async unsubscribe(emailOrToken: string): Promise<{ success: boolean; message: string }> {
    try {
      return await safeFetchJson('/api/subscribers/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ email: emailOrToken, token: emailOrToken }),
      });
    } catch (err: any) {
      console.error('NewsletterClientService.unsubscribe error:', err);
      throw err;
    }
  }

  /**
   * Admin: Get all subscribers
   */
  static async getSubscribers(filter?: {
    status?: string;
    topic?: string;
    frequency?: string;
    search?: string;
  }): Promise<NewsletterSubscriber[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status && filter.status !== 'All') params.append('status', filter.status);
      if (filter?.topic && filter.topic !== 'All') params.append('topic', filter.topic);
      if (filter?.frequency && filter.frequency !== 'All') params.append('frequency', filter.frequency);
      if (filter?.search) params.append('search', filter.search);

      const json = await safeFetchJson<any>(`/api/subscribers?${params.toString()}`);
      return json?.subscribers || (Array.isArray(json) ? json : []);
    } catch (err: any) {
      console.error('NewsletterClientService.getSubscribers error:', err);
      throw err;
    }
  }

  /**
   * Admin: Get subscriber analytics and breakdown
   */
  static async getAnalytics(): Promise<NewsletterAnalyticsSummary> {
    try {
      const json = await safeFetchJson<any>('/api/subscribers/stats');
      return json?.stats || json;
    } catch (err: any) {
      console.error('NewsletterClientService.getAnalytics error:', err);
      throw err;
    }
  }

  /**
   * Admin: Create subscriber manually
   */
  static async createSubscriber(data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
    try {
      const json = await safeFetchJson<any>('/api/subscribers/admin-create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return json?.subscriber || json;
    } catch (err: any) {
      console.error('NewsletterClientService.createSubscriber error:', err);
      throw err;
    }
  }

  /**
   * Admin: Update subscriber
   */
  static async updateSubscriber(id: string, data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
    try {
      const json = await safeFetchJson<any>(`/api/subscribers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return json?.subscriber || json;
    } catch (err: any) {
      console.error('NewsletterClientService.updateSubscriber error:', err);
      throw err;
    }
  }

  /**
   * Admin: Delete subscriber
   */
  static async deleteSubscriber(id: string): Promise<boolean> {
    try {
      await safeFetchJson(`/api/subscribers/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (err: any) {
      console.error('NewsletterClientService.deleteSubscriber error:', err);
      throw err;
    }
  }

  /**
   * Admin: Bulk update subscriber status
   */
  static async bulkUpdateStatus(ids: string[], status: SubscriberStatus): Promise<number> {
    try {
      const json = await safeFetchJson<any>('/api/subscribers/bulk-status', {
        method: 'POST',
        body: JSON.stringify({ ids, status }),
      });
      return json?.updatedCount || ids.length;
    } catch (err: any) {
      console.error('NewsletterClientService.bulkUpdateStatus error:', err);
      throw err;
    }
  }

  /**
   * Admin: Bulk delete subscribers
   */
  static async bulkDelete(ids: string[]): Promise<number> {
    try {
      const json = await safeFetchJson<any>('/api/subscribers/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
      return json?.deletedCount || ids.length;
    } catch (err: any) {
      console.error('NewsletterClientService.bulkDelete error:', err);
      throw err;
    }
  }

  /**
   * Admin: Broadcast campaign
   */
  static async sendBroadcastCampaign(data: {
    subject: string;
    previewText?: string;
    content: string;
    targetTopics?: string[];
    targetFrequency?: string;
    createdBy?: string;
  }): Promise<NewsletterCampaign> {
    try {
      const json = await safeFetchJson<any>('/api/subscribers/campaigns/broadcast', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return json?.campaign || json;
    } catch (err: any) {
      console.error('NewsletterClientService.sendBroadcastCampaign error:', err);
      throw err;
    }
  }

  /**
   * Admin: Get campaign history
   */
  static async getCampaignHistory(): Promise<NewsletterCampaign[]> {
    try {
      const json = await safeFetchJson<any>('/api/subscribers/campaigns/history');
      return json?.campaigns || (Array.isArray(json) ? json : []);
    } catch (err: any) {
      console.error('NewsletterClientService.getCampaignHistory error:', err);
      throw err;
    }
  }
}
