import { db } from '../db';
import { logger } from '../utils/logger';

export class IssueService {
  private static collectionName = 'issues';

  static async getAllIssues(): Promise<any[]> {
    console.log(`[Database GET] collection: ${this.collectionName}`);
    const snap = await db.collection(this.collectionName).get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getIssuesByJournal(journalId: string): Promise<any[]> {
    console.log(`[Database GET] query: ${this.collectionName} (journalId==${journalId})`);
    const snap = await db.collection(this.collectionName).where('journalId', '==', journalId).get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getIssueById(id: string): Promise<any | null> {
    console.log(`[Database GET] doc: ${this.collectionName}/${id}`);
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (doc && doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  }

  static async createIssue(data: any): Promise<any> {
    const id = data.id || `i_${Date.now()}`;
    const newIssue = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    console.log(`[Database POST] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(newIssue, { merge: true });
    return newIssue;
  }

  static async updateIssue(id: string, data: any): Promise<any> {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    console.log(`[Database PUT] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(updated, { merge: true });
    return updated;
  }

  static async deleteIssue(id: string): Promise<boolean> {
    console.log(`[Database DELETE] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).delete();
    return true;
  }
}
