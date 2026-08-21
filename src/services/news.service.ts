import { db } from '../db';
import { logger } from '../utils/logger';

export class NewsService {
  private static collectionName = 'news';

  static async getAllNews(): Promise<any[]> {
    console.log(`[Database GET] collection: ${this.collectionName}`);
    const snap = await db.collection(this.collectionName).get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getNewsById(id: string): Promise<any | null> {
    console.log(`[Database GET] doc: ${this.collectionName}/${id}`);
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (doc && doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  }

  static async createNews(data: any): Promise<any> {
    const id = data.id || `n_${Date.now()}`;
    const newItem = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    console.log(`[Database POST] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(newItem, { merge: true });
    console.log(`[Database POST] doc: announcements/${id}`);
    await db.collection('announcements').doc(id).set(newItem, { merge: true });
    return newItem;
  }

  static async updateNews(id: string, data: any): Promise<any> {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    console.log(`[Database PUT] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(updated, { merge: true });
    console.log(`[Database PUT] doc: announcements/${id}`);
    await db.collection('announcements').doc(id).set(updated, { merge: true });
    return updated;
  }

  static async deleteNews(id: string): Promise<boolean> {
    console.log(`[Database DELETE] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).delete();
    console.log(`[Database DELETE] doc: announcements/${id}`);
    await db.collection('announcements').doc(id).delete();
    return true;
  }
}
