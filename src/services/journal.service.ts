import { db } from '../db';
import { logger } from '../utils/logger';

export class JournalService {
  private static collectionName = 'journals';

  static async getAllJournals(): Promise<any[]> {
    console.log(`[Database GET] collection: ${this.collectionName}`);
    const snap = await db.collection(this.collectionName).get();
    if (!snap || !snap.docs) {
      return [];
    }
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getJournalById(id: string): Promise<any | null> {
    console.log(`[Database GET] doc: ${this.collectionName}/${id}`);
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (doc && doc.exists) {
      return { id: doc.id, ...doc.data() };
    }

    // Try finding by code
    const querySnap = await db.collection(this.collectionName).where('code', '==', id.toUpperCase()).limit(1).get();
    if (querySnap && !querySnap.empty) {
      const d = querySnap.docs[0];
      return { id: d.id, ...d.data() };
    }

    return null;
  }

  static async createJournal(data: any): Promise<any> {
    const id = data.id || `j_${Date.now()}`;
    const newJournal = {
      ...data,
      id,
      isActive: data.isActive !== undefined ? data.isActive : true,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    console.log(`[Database POST] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(newJournal, { merge: true });
    return newJournal;
  }

  static async updateJournal(id: string, data: any): Promise<any> {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    console.log(`[Database PUT] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(updated, { merge: true });
    return updated;
  }

  static async deleteJournal(id: string): Promise<boolean> {
    console.log(`[Database DELETE] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).delete();
    return true;
  }
}
