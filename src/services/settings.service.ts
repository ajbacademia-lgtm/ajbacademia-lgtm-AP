import { db } from '../db';
import { logger } from '../utils/logger';

export class SettingsService {
  private static collectionName = 'settings';

  static async getSettings(): Promise<Record<string, any>> {
    console.log(`[Database GET] collection: ${this.collectionName}`);
    const snap = await db.collection(this.collectionName).get();
    const result: Record<string, any> = {};
    if (snap && snap.docs) {
      snap.docs.forEach((doc: any) => {
        const data = doc.data();
        result[doc.id] = data.value !== undefined ? data.value : data;
      });
    }
    return result;
  }

  static async updateSettings(settingsObject: Record<string, any>): Promise<Record<string, any>> {
    for (const [key, value] of Object.entries(settingsObject)) {
      console.log(`[Database PUT] doc: ${this.collectionName}/${key}`);
      await db.collection(this.collectionName).doc(key).set({
        key,
        value,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return settingsObject;
  }
}
