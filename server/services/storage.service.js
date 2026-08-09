import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export class StorageService {
  static UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'resumes');

  /**
   * Initializes the storage directory if it doesn't exist
   */
  static async init() {
    try {
      await fs.access(this.UPLOAD_DIR);
    } catch {
      await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    }
  }

  /**
   * Uploads a base64 encoded file to local storage
   * @param {string} base64Data 
   * @param {string} originalName 
   * @param {string} tenantId 
   * @param {string} studentId 
   * @returns {Promise<string>} The relative file URL
   */
  static async uploadFile(base64Data, originalName, tenantId, studentId) {
    await this.init();

    // Remove data URI scheme prefix if present (e.g. data:application/pdf;base64,)
    const base64String = base64Data.replace(/^data:[a-zA-Z0-9+\/.-]+;base64,/, '');
    
    // Generate secure filename: tenantId_studentId_timestamp_random.ext
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    
    // Strict extension validation
    const allowedExts = ['.pdf', '.doc', '.docx'];
    if (!allowedExts.includes(ext)) {
      throw new Error('Invalid file extension. Only .pdf, .doc, and .docx are allowed.');
    }

    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    const secureFileName = `${tenantId}_${studentId}_${timestamp}_${random}${ext}`;
    
    const filePath = path.join(this.UPLOAD_DIR, secureFileName);
    
    const buffer = Buffer.from(base64String, 'base64');
    
    // Strict server-side 10MB size validation
    if (buffer.length > 10 * 1024 * 1024) {
      throw new Error('File size exceeds the 10MB limit.');
    }
    
    // Write the binary data to disk
    await fs.writeFile(filePath, buffer);

    // Return the relative URL for static serving
    return `/uploads/resumes/${secureFileName}`;
  }

  /**
   * Deletes a file from local storage
   * @param {string} fileUrl 
   */
  static async deleteFile(fileUrl) {
    if (!fileUrl) return;
    
    try {
      // Extract filename from URL (e.g. /uploads/resumes/filename.pdf)
      const fileName = fileUrl.split('/').pop();
      if (!fileName) return;

      const filePath = path.join(this.UPLOAD_DIR, fileName);
      
      // Ensure we're not deleting outside the uploads directory (path traversal check)
      const normalizedPath = path.normalize(filePath);
      if (!normalizedPath.startsWith(this.UPLOAD_DIR)) {
        console.warn('Attempted path traversal deletion blocked:', fileUrl);
        return;
      }

      await fs.unlink(normalizedPath);
    } catch (error) {
      // Ignore if file already doesn't exist (e.g., ENOENT)
      if (error.code !== 'ENOENT') {
        console.error('Error deleting file:', error);
      }
    }
  }

  /**
   * Helper to resolve physical file path from URL
   */
  static getPhysicalPath(fileUrl) {
    if (!fileUrl) return null;
    const fileName = fileUrl.split('/').pop();
    return path.join(this.UPLOAD_DIR, fileName);
  }
}
