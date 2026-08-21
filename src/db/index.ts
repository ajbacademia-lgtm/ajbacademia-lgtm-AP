import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  getMySQLPool,
  testMySQLConnection,
  initMySQLSchema,
  getCollectionDocs as getMySQLCollectionDocs,
  getCollectionDocById as getMySQLDocById,
  saveCollectionDoc as saveMySQLDoc,
  deleteCollectionDoc as deleteMySQLDoc,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER
} from './mysql';
import { storageAdapter } from '../services/storageAdapter';

dotenv.config();

// Export MySQL connection & query helpers
export {
  getMySQLPool,
  testMySQLConnection,
  initMySQLSchema,
  getMySQLCollectionDocs as getCollectionDocs,
  getMySQLDocById as getCollectionDocById,
  saveMySQLDoc as saveCollectionDoc,
  deleteMySQLDoc as deleteCollectionDoc,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER
};

// Storage Adapter Wrapper for backwards compatibility
export const storageBucket = {
  name: 'hostinger-local-storage',
  file(filePath: string) {
    return {
      async save(buffer: Buffer, _options?: any) {
        const subDir = path.dirname(filePath);
        const fileName = path.basename(filePath);
        await storageAdapter.saveFile({
          fileName,
          fileBuffer: buffer,
          mimeType: 'application/octet-stream',
          subDirectory: subDir,
          isPrivate: false
        });
      },
      async delete() {
        await storageAdapter.deleteFile(filePath);
      },
      async exists() {
        return [storageAdapter.fileExists(filePath)];
      },
      createReadStream() {
        return storageAdapter.getFileStream(filePath);
      }
    };
  }
};

export const storageBucketName = 'hostinger-storage';

// --- MySQL Relational Query Builder & Document Adapter Bridge ---
class MySQLQueryBuilder {
  private filters: { field: string; op: string; value: any }[] = [];
  private orderField?: string;
  private orderDirection?: 'asc' | 'desc';
  private limitCount?: number;

  constructor(private colName: string) {}

  where(field: string, op: string, value: any): MySQLQueryBuilder {
    this.filters.push({ field, op, value });
    return this;
  }

  orderBy(field: string, direction?: string): MySQLQueryBuilder {
    this.orderField = field;
    this.orderDirection = (direction?.toLowerCase() === 'desc') ? 'desc' : 'asc';
    return this;
  }

  limit(n: number): MySQLQueryBuilder {
    this.limitCount = n;
    return this;
  }

  async get(): Promise<{ docs: any[]; empty: boolean; size: number }> {
    let docs = await getMySQLCollectionDocs(this.colName);

    // Apply where filters
    for (const filter of this.filters) {
      docs = docs.filter(item => {
        const val = item[filter.field];
        if (filter.op === '==' || filter.op === '=') {
          return String(val) === String(filter.value);
        } else if (filter.op === '!=') {
          return String(val) !== String(filter.value);
        } else if (filter.op === '>') {
          return val > filter.value;
        } else if (filter.op === '>=') {
          return val >= filter.value;
        } else if (filter.op === '<') {
          return val < filter.value;
        } else if (filter.op === '<=') {
          return val <= filter.value;
        } else if (filter.op === 'array-contains') {
          return Array.isArray(val) && val.includes(filter.value);
        }
        return true;
      });
    }

    // Apply sorting
    if (this.orderField) {
      const field = this.orderField;
      const dir = this.orderDirection === 'desc' ? -1 : 1;
      docs.sort((a, b) => {
        const valA = a[field] ?? '';
        const valB = b[field] ?? '';
        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    // Apply limit
    if (this.limitCount && this.limitCount > 0) {
      docs = docs.slice(0, this.limitCount);
    }

    const formattedDocs = docs.map(d => ({
      id: d.id,
      exists: true,
      data: () => d
    }));

    return {
      docs: formattedDocs,
      empty: formattedDocs.length === 0,
      size: formattedDocs.length
    };
  }
}

class MySQLDocReference {
  constructor(private colName: string, public id: string) {}

  collection(subColName: string) {
    return db.collection(`${this.colName}/${this.id}/${subColName}`);
  }

  async get(): Promise<{ id: string; exists: boolean; data: () => any }> {
    const doc = await getMySQLDocById(this.colName, this.id);
    return {
      id: this.id,
      exists: doc !== null,
      data: () => doc
    };
  }

  async set(data: any, options?: { merge?: boolean }): Promise<void> {
    const existing = options?.merge ? (await getMySQLDocById(this.colName, this.id)) : null;
    const finalData = {
      ...(existing || {}),
      ...data,
      id: this.id
    };
    await saveMySQLDoc(this.colName, this.id, finalData, false);
  }

  async update(data: any): Promise<void> {
    const existing = await getMySQLDocById(this.colName, this.id);
    const finalData = {
      ...(existing || {}),
      ...data,
      id: this.id,
      updatedAt: new Date().toISOString()
    };
    await saveMySQLDoc(this.colName, this.id, finalData, false);
  }

  async delete(): Promise<void> {
    await deleteMySQLDoc(this.colName, this.id);
  }
}

// Unified Database Adapter backed purely by MySQL
export const db = {
  collection(colName: string) {
    return {
      doc(id?: string) {
        const docId = id || ('doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
        return new MySQLDocReference(colName, docId);
      },
      where(field: string, op: string, value: any) {
        return new MySQLQueryBuilder(colName).where(field, op, value);
      },
      orderBy(field: string, direction?: string) {
        return new MySQLQueryBuilder(colName).orderBy(field, direction);
      },
      limit(n: number) {
        return new MySQLQueryBuilder(colName).limit(n);
      },
      async get() {
        const docs = await getMySQLCollectionDocs(colName);
        const formattedDocs = docs.map(d => ({
          id: d.id,
          exists: true,
          data: () => d
        }));
        return {
          docs: formattedDocs,
          empty: formattedDocs.length === 0,
          size: formattedDocs.length
        };
      },
      async add(data: any) {
        const docId = data.id || ('doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
        const fullData = { ...data, id: docId };
        await saveMySQLDoc(colName, docId, fullData, true);
        return new MySQLDocReference(colName, docId);
      }
    };
  }
};

export const dbPrimary = db as any;
export const dbDefault = db as any;

export default db;
