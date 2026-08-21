import { db } from '../db';
import { logger } from '../utils/logger';

export class ArticleService {
  private static collectionName = 'articles';

  static async getAllArticles(statusFilter?: string): Promise<any[]> {
    let ref: any = db.collection(this.collectionName);
    if (statusFilter) {
      console.log(`[Database GET] query: ${this.collectionName} (status==${statusFilter})`);
      ref = ref.where('status', '==', statusFilter);
    } else {
      console.log(`[Database GET] collection: ${this.collectionName}`);
    }
    const snap = await ref.get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getArticlesByJournal(journalId: string): Promise<any[]> {
    console.log(`[Database GET] query: ${this.collectionName} (journalId==${journalId})`);
    const snap = await db.collection(this.collectionName).where('journalId', '==', journalId).get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getArticlesByIssue(issueId: string): Promise<any[]> {
    console.log(`[Database GET] query: ${this.collectionName} (issueId==${issueId})`);
    const snap = await db.collection(this.collectionName).where('issueId', '==', issueId).get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getArticleById(id: string): Promise<any | null> {
    console.log(`[Database GET] doc: ${this.collectionName}/${id}`);
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (doc && doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  }

  static async createArticle(data: any): Promise<any> {
    const id = data.id || `a_${Date.now()}`;
    const newArticle = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    console.log(`[Database POST] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(newArticle, { merge: true });
    return newArticle;
  }

  static async updateArticle(id: string, data: any): Promise<any> {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    console.log(`[Database PUT] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(updated, { merge: true });
    return updated;
  }

  static async deleteArticle(id: string): Promise<boolean> {
    console.log(`[Database DELETE] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).delete();
    return true;
  }
}
