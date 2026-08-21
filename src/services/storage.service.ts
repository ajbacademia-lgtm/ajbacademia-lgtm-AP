import { storageAdapter } from './storageAdapter';
import { getCollectionDocs, getCollectionDocById, saveCollectionDoc } from '../db/mysql';

export class StorageService {
  /**
   * Generates public downloadable media URL for a file
   */
  static getDownloadUrl(filePath: string): string {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    if (filePath.startsWith('/uploads/')) {
      return filePath;
    }
    return `/uploads/public/${filePath}`;
  }

  /**
   * Upload or replace PDF file in Storage at journals/{journalId}/articles/{articleId}.pdf
   */
  static async uploadArticlePdf(
    journalId: string,
    articleId: string,
    fileBuffer: Buffer,
    mimeType: string,
    isReplace: boolean = false
  ): Promise<{ success: boolean; pdfUrl: string; filePath: string; error?: string }> {
    const fileName = `${articleId}.pdf`;
    const subDirectory = `journals/${journalId}/articles`;

    // Validate mime type
    if (mimeType !== 'application/pdf') {
      return {
        success: false,
        pdfUrl: '',
        filePath: `${subDirectory}/${fileName}`,
        error: 'Invalid file type. Only PDF documents (application/pdf) are allowed.'
      };
    }

    // Validate size (30 MB max)
    const MAX_SIZE = 30 * 1024 * 1024;
    if (fileBuffer.length > MAX_SIZE) {
      return {
        success: false,
        pdfUrl: '',
        filePath: `${subDirectory}/${fileName}`,
        error: `File size exceeds maximum limit of 30MB (received ${Math.round(fileBuffer.length / (1024 * 1024))}MB)`
      };
    }

    try {
      const result = await storageAdapter.saveFile({
        fileName,
        fileBuffer,
        mimeType: 'application/pdf',
        subDirectory,
        isPrivate: false // Published article PDFs are publicly accessible
      });

      if (!result.success) {
        return {
          success: false,
          pdfUrl: '',
          filePath: result.storagePath,
          error: result.error || 'Failed to save PDF file'
        };
      }

      // Update Article record in MySQL
      const article = await getCollectionDocById('articles', articleId);
      if (article) {
        article.pdfUrl = result.publicUrl;
        article.storagePath = result.storagePath;
        article.updatedAt = new Date().toISOString();
        await saveCollectionDoc('articles', articleId, article);
      }

      return {
        success: true,
        pdfUrl: result.publicUrl,
        filePath: result.storagePath
      };
    } catch (err: any) {
      return {
        success: false,
        pdfUrl: '',
        filePath: `${subDirectory}/${fileName}`,
        error: err.message || 'Failed to upload PDF file.'
      };
    }
  }

  /**
   * Upload or replace Journal Cover Image
   */
  static async uploadJournalCover(
    journalId: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ success: boolean; coverUrl: string; filePath: string; error?: string }> {
    const subDirectory = `journals/${journalId}/covers`;
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const fileName = `cover_${journalId}.${ext}`;

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimes.includes(mimeType)) {
      return {
        success: false,
        coverUrl: '',
        filePath: '',
        error: 'Invalid image format. Only JPG, PNG, and WebP images are allowed.'
      };
    }

    try {
      const result = await storageAdapter.saveFile({
        fileName,
        fileBuffer,
        mimeType,
        subDirectory,
        isPrivate: false
      });

      if (!result.success) {
        return {
          success: false,
          coverUrl: '',
          filePath: result.storagePath,
          error: result.error || 'Failed to upload journal cover'
        };
      }

      // Update Journal record in MySQL
      const journal = await getCollectionDocById('journals', journalId);
      if (journal) {
        journal.coverImage = result.publicUrl;
        journal.updatedAt = new Date().toISOString();
        await saveCollectionDoc('journals', journalId, journal);
      }

      return {
        success: true,
        coverUrl: result.publicUrl,
        filePath: result.storagePath
      };
    } catch (err: any) {
      return {
        success: false,
        coverUrl: '',
        filePath: '',
        error: err.message || 'Failed to upload journal cover image.'
      };
    }
  }

  /**
   * Upload author submission manuscript (Confidential - Private Access)
   */
  static async uploadManuscript(
    submissionId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ success: boolean; downloadUrl: string; storagePath: string; error?: string }> {
    const subDirectory = `submissions/${submissionId}`;

    try {
      const result = await storageAdapter.saveFile({
        fileName: originalName,
        fileBuffer,
        mimeType,
        subDirectory,
        isPrivate: true // Strictly Private Access
      });

      if (!result.success) {
        return {
          success: false,
          downloadUrl: '',
          storagePath: '',
          error: result.error
        };
      }

      return {
        success: true,
        downloadUrl: result.publicUrl,
        storagePath: result.storagePath
      };
    } catch (err: any) {
      return {
        success: false,
        downloadUrl: '',
        storagePath: '',
        error: err.message || 'Failed to upload manuscript.'
      };
    }
  }

  /**
   * Delete Article PDF from storage
   */
  static async deleteArticlePdf(journalId: string, articleId: string): Promise<{ success: boolean; error?: string }> {
    const fileName = `${articleId}.pdf`;
    const relativePath = `journals/${journalId}/articles/${fileName}`;
    const deleted = await storageAdapter.deleteFile(relativePath);
    return { success: deleted };
  }

  /**
   * Stream Article PDF for inline viewing or download
   */
  static async getArticlePdfStream(journalId: string, articleId: string): Promise<{ stream?: any; pdfUrl?: string }> {
    const fileName = `${articleId}.pdf`;
    const relativePath = `journals/${journalId}/articles/${fileName}`;

    if (storageAdapter.fileExists(relativePath)) {
      const stream = storageAdapter.getFileStream(relativePath);
      return { stream, pdfUrl: `/uploads/public/${relativePath}` };
    }

    const article = await getCollectionDocById('articles', articleId);
    if (article?.pdfUrl) {
      return { pdfUrl: article.pdfUrl };
    }

    return {};
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    return await storageAdapter.deleteFile(filePath);
  }
}
