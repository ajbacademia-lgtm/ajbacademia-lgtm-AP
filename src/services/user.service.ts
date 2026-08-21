import { db } from '../db';
import { logger } from '../utils/logger';

export class UserService {
  private static collectionName = 'users';

  static async getAllUsers(): Promise<any[]> {
    console.log(`[Database GET] collection: ${this.collectionName}`);
    const snap = await db.collection(this.collectionName).get();
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => {
      const data = d.data();
      const { passwordHash, ...safeUser } = data;
      return { id: d.id, ...safeUser };
    });
  }

  static async getUserById(id: string): Promise<any | null> {
    console.log(`[Database GET] doc: ${this.collectionName}/${id}`);
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (doc && doc.exists) {
      const data = doc.data() as any;
      const { passwordHash, ...safeUser } = data;
      return { id: doc.id, ...safeUser };
    }
    return null;
  }

  static async createUser(data: any): Promise<any> {
    const id = data.id || `u_${Date.now()}`;
    const newUser = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    console.log(`[Database POST] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(newUser, { merge: true });
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  static async updateUser(id: string, data: any): Promise<any> {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    console.log(`[Database PUT] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).set(updated, { merge: true });
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  static async deleteUser(id: string): Promise<boolean> {
    console.log(`[Database DELETE] doc: ${this.collectionName}/${id}`);
    await db.collection(this.collectionName).doc(id).delete();
    return true;
  }
}
