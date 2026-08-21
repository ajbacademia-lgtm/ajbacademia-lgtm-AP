import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storageAdapter } from '../services/storageAdapter';
import { requireAuth } from '../middleware/auth.middleware';
import { getUploadRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024 // 30 MB maximum file size
  }
});

/**
 * POST /api/files/upload
 * Generic secure file upload endpoint
 */
router.post('/upload', requireAuth, getUploadRateLimiter(), upload.single('file'), async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided for upload.' });
    }

    const subDirectory = req.body.subDirectory || 'general';
    const isPrivate = req.body.isPrivate === 'true' || req.body.isPrivate === true;

    const result = await storageAdapter.saveFile({
      fileName: req.file.originalname,
      fileBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      subDirectory,
      isPrivate
    });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      file: {
        id: result.fileId,
        fileName: result.fileName,
        url: result.publicUrl,
        storagePath: result.storagePath,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        checksum: result.checksumSha256,
        isPrivate: result.isPrivate
      }
    });
  } catch (err: any) {
    console.error('[Upload Error]:', err);
    return res.status(500).json({ success: false, error: 'File upload failed.' });
  }
});

/**
 * GET /api/files/download/{*filePath}
 * Authenticated proxy endpoint for private documents (manuscripts, reviews, confidential reports)
 */
router.get('/download/{*filePath}', requireAuth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const rawParam = req.params.filePath;
    const rawPath = Array.isArray(rawParam) ? rawParam[0] : rawParam;
    if (!rawPath) {
      return res.status(400).json({ success: false, error: 'File path required' });
    }

    const filePath = decodeURIComponent(rawPath);

    // Prevent directory traversal
    if (filePath.includes('..')) {
      return res.status(403).json({ success: false, error: 'Access denied. Invalid path structure.' });
    }

    if (!storageAdapter.fileExists(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found on storage server.' });
    }

    const absolutePath = storageAdapter.getFilePath(filePath);
    const fileName = path.basename(absolutePath);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const stream = storageAdapter.getFileStream(filePath);
    stream.pipe(res);
  } catch (err: any) {
    console.error('[Download Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to stream requested file.' });
  }
});

export default router;
