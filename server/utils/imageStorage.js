// Utility for handling image storage with fallback mechanisms
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ImageStorageManager {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.baseUploadDir = this.isProduction 
      ? process.env.UPLOAD_DIR || '/opt/render/project/src/uploads'
      : path.join(__dirname, '../uploads');
    
    this.initializeDirectory();
  }

  initializeDirectory() {
    try {
      if (!fs.existsSync(this.baseUploadDir)) {
        fs.mkdirSync(this.baseUploadDir, { recursive: true });
        console.log(`📁 Created uploads directory: ${this.baseUploadDir}`);
      }

      // Test write permissions
      const testFile = path.join(this.baseUploadDir, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✅ Upload directory writable: ${this.baseUploadDir}`);
    } catch (error) {
      console.error(`❌ Error setting up upload directory: ${error.message}`);
      
      // Fallback to a local directory in production
      if (this.isProduction) {
        this.baseUploadDir = './uploads';
        try {
          if (!fs.existsSync(this.baseUploadDir)) {
            fs.mkdirSync(this.baseUploadDir, { recursive: true });
          }
          console.log(`📁 Fallback directory created: ${this.baseUploadDir}`);
        } catch (fallbackError) {
          console.error(`❌ Fallback directory failed: ${fallbackError.message}`);
        }
      }
    }
  }

  getUploadPath() {
    return this.baseUploadDir;
  }

  // Verify if an image exists
  imageExists(filename) {
    if (!filename) return false;
    const imagePath = path.join(this.baseUploadDir, filename);
    return fs.existsSync(imagePath);
  }

  // Get image URL with fallback
  getImageUrl(filename, baseUrl = '') {
    if (!filename) return null;
    
    // If image doesn't exist, return a placeholder or null
    if (!this.imageExists(filename)) {
      console.warn(`⚠️ Image not found: ${filename}`);
      return null; // Frontend should handle missing images gracefully
    }
    
    return `${baseUrl}/uploads/${filename}`;
  }

  // Clean up old images (for maintenance)
  cleanupOldImages(daysOld = 30) {
    try {
      const files = fs.readdirSync(this.baseUploadDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      let deletedCount = 0;
      files.forEach(file => {
        const filePath = path.join(this.baseUploadDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });
      
      console.log(`🧹 Cleanup completed: ${deletedCount} old files removed`);
      return deletedCount;
    } catch (error) {
      console.error(`❌ Cleanup failed: ${error.message}`);
      return 0;
    }
  }

  // List all images with metadata
  listImages() {
    try {
      const files = fs.readdirSync(this.baseUploadDir);
      return files
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .map(file => {
          const filePath = path.join(this.baseUploadDir, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
        .sort((a, b) => b.modified - a.modified);
    } catch (error) {
      console.error(`❌ Error listing images: ${error.message}`);
      return [];
    }
  }

  // Generate backup information
  generateBackupReport() {
    const images = this.listImages();
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    
    return {
      timestamp: new Date().toISOString(),
      directory: this.baseUploadDir,
      totalImages: images.length,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      oldestImage: images.length > 0 ? images[images.length - 1].created : null,
      newestImage: images.length > 0 ? images[0].created : null,
      isProduction: this.isProduction,
      images: images
    };
  }
}

// Create singleton instance
const imageStorage = new ImageStorageManager();

export default imageStorage;
export { ImageStorageManager };
