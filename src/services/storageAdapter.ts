import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageFileResult {
  success: boolean;
  fileId: string;
  storagePath: string;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  checksumSha256: string;
  isPrivate: boolean;
  error?: string;
}

export interface IStorageAdapter {
  saveFile(params: {
    fileName: string;
    fileBuffer: Buffer;
    mimeType: string;
    subDirectory: string;
    isPrivate?: boolean;
  }): Promise<StorageFileResult>;
  
  deleteFile(storagePath: string): Promise<boolean>;
  getFilePath(storagePath: string): string;
  getFileStream(storagePath: string): fs.ReadStream;
  fileExists(storagePath: string): boolean;
}

/**
 * Hostinger Local Disk Storage Provider
 * Stores files outside webroot in /uploads with segregated /public and /private directories
 */
export class HostingerLocalStorageAdapter implements IStorageAdapter {
  private baseUploadDir: string;

  constructor(customBaseDir?: string) {
    this.baseUploadDir = customBaseDir || process.env.STORAGE_BASE_DIR || path.resolve(process.cwd(), 'uploads');
    this.ensureDirectoryExists(this.baseUploadDir);
    this.ensureDirectoryExists(path.join(this.baseUploadDir, 'public'));
    this.ensureDirectoryExists(path.join(this.baseUploadDir, 'private'));
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
    }
  }

  private calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private sanitizeFilename(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
  }

  public async saveFile(params: {
    fileName: string;
    fileBuffer: Buffer;
    mimeType: string;
    subDirectory: string;
    isPrivate?: boolean;
  }): Promise<StorageFileResult> {
    if (params.fileName.includes('..') || params.subDirectory.includes('..')) {
      throw new Error('Directory traversal attempt detected in path or filename.');
    }

    const isPrivate = params.isPrivate ?? false;
    const fileId = 'file_' + Date.now() + '_' + crypto.randomBytes(6).toString('hex');
    const safeName = this.sanitizeFilename(params.fileName);
    const checksum = this.calculateChecksum(params.fileBuffer);
    
    // Determine extension safely
    const ext = path.extname(safeName).toLowerCase();
    const disallowedExtensions = ['.php', '.phtml', '.exe', '.sh', '.js', '.ts', '.html', '.htm', '.pl', '.cgi', '.py'];
    if (disallowedExtensions.includes(ext)) {
      return {
        success: false,
        fileId: '',
        storagePath: '',
        publicUrl: '',
        fileName: safeName,
        fileSize: params.fileBuffer.length,
        mimeType: params.mimeType,
        checksumSha256: checksum,
        isPrivate,
        error: `Disallowed executable file extension: ${ext}`
      };
    }

    const visibilityFolder = isPrivate ? 'private' : 'public';
    const relativeTargetDir = path.join(visibilityFolder, params.subDirectory);
    const absoluteTargetDir = path.join(this.baseUploadDir, relativeTargetDir);
    this.ensureDirectoryExists(absoluteTargetDir);

    const storedFileName = `${fileId}_${safeName}`;
    const relativeFilePath = path.join(relativeTargetDir, storedFileName);
    const absoluteFilePath = path.join(this.baseUploadDir, relativeFilePath);

    try {
      fs.writeFileSync(absoluteFilePath, params.fileBuffer, { mode: 0o644 });

      // Generate public URL for public assets or tokenized proxy download URL for private files
      const publicUrl = isPrivate
        ? `/api/files/download/${encodeURIComponent(relativeFilePath)}`
        : `/uploads/public/${params.subDirectory}/${storedFileName}`;

      return {
        success: true,
        fileId,
        storagePath: relativeFilePath,
        publicUrl,
        fileName: safeName,
        fileSize: params.fileBuffer.length,
        mimeType: params.mimeType,
        checksumSha256: checksum,
        isPrivate
      };
    } catch (err: any) {
      return {
        success: false,
        fileId: '',
        storagePath: '',
        publicUrl: '',
        fileName: safeName,
        fileSize: params.fileBuffer.length,
        mimeType: params.mimeType,
        checksumSha256: checksum,
        isPrivate,
        error: err.message || 'Failed to write file to storage'
      };
    }
  }

  public async deleteFile(storagePath: string): Promise<boolean> {
    const fullPath = this.getFilePath(storagePath);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public getFilePath(storagePath: string): string {
    // Prevent path traversal attacks
    const normalized = path.normalize(storagePath).replace(/^(\.\.[\/\\])+/, '');
    return path.join(this.baseUploadDir, normalized);
  }

  public getFileStream(storagePath: string): fs.ReadStream {
    const fullPath = this.getFilePath(storagePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found at storage path: ${storagePath}`);
    }
    return fs.createReadStream(fullPath);
  }

  public fileExists(storagePath: string): boolean {
    const fullPath = this.getFilePath(storagePath);
    return fs.existsSync(fullPath);
  }
}

// Global Storage Adapter instance configured for Hostinger Node.js filesystem
export const storageAdapter: IStorageAdapter = new HostingerLocalStorageAdapter();
