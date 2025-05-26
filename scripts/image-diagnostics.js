#!/usr/bin/env node

// Image diagnostics script for production environment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ImageDiagnostics {
  constructor() {
    this.uploadPaths = [
      path.join(__dirname, '../server/uploads'),
      '/opt/render/project/src/uploads',
      './uploads',
      process.env.UPLOAD_DIR || 'uploads'
    ];
  }

  checkUploadDirectories() {
    console.log('🔍 Checking upload directories...\n');
    
    const results = this.uploadPaths.map(dirPath => {
      const exists = fs.existsSync(dirPath);
      let writable = false;
      let files = [];
      let error = null;

      if (exists) {
        try {
          // Test write permissions
          const testFile = path.join(dirPath, '.test-write');
          fs.writeFileSync(testFile, 'test');
          fs.unlinkSync(testFile);
          writable = true;

          // List image files
          files = fs.readdirSync(dirPath)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);
              return {
                name: file,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
              };
            });
        } catch (err) {
          error = err.message;
        }
      }

      return {
        path: dirPath,
        exists,
        writable,
        files,
        error
      };
    });

    results.forEach(result => {
      console.log(`📁 ${result.path}`);
      console.log(`   Exists: ${result.exists ? '✅' : '❌'}`);
      console.log(`   Writable: ${result.writable ? '✅' : '❌'}`);
      console.log(`   Images: ${result.files.length}`);
      if (result.error) {
        console.log(`   Error: ❌ ${result.error}`);
      }
      if (result.files.length > 0) {
        console.log(`   Latest: ${result.files[0]?.name || 'N/A'}`);
      }
      console.log('');
    });

    return results;
  }

  generateReport() {
    const results = this.checkUploadDirectories();
    const workingDirs = results.filter(r => r.exists && r.writable);
    const totalImages = results.reduce((sum, r) => sum + r.files.length, 0);

    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('====================');
    console.log(`Working directories: ${workingDirs.length}/${results.length}`);
    console.log(`Total images found: ${totalImages}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Platform: ${process.platform}`);
    console.log('');

    if (workingDirs.length === 0) {
      console.log('❌ CRITICAL: No working upload directories found!');
      console.log('');
      console.log('🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Check if upload directory exists');
      console.log('2. Verify write permissions');
      console.log('3. Check environment variables');
      console.log('4. Ensure disk space is available');
    } else {
      console.log('✅ Upload system appears to be working');
      const mainDir = workingDirs[0];
      console.log(`📁 Primary directory: ${mainDir.path}`);
      console.log(`📸 Images available: ${mainDir.files.length}`);
    }

    return {
      workingDirectories: workingDirs.length,
      totalImages,
      results
    };
  }

  async testImageUpload() {
    console.log('\n🧪 TESTING IMAGE UPLOAD...');
    
    const workingDirs = this.checkUploadDirectories().filter(r => r.exists && r.writable);
    
    if (workingDirs.length === 0) {
      console.log('❌ Cannot test upload - no writable directories');
      return false;
    }

    try {
      const testDir = workingDirs[0].path;
      const testFileName = `test-${Date.now()}.txt`;
      const testFilePath = path.join(testDir, testFileName);
      
      // Create test file
      fs.writeFileSync(testFilePath, 'Image upload test file');
      console.log(`✅ Test file created: ${testFileName}`);
      
      // Check if file exists
      const exists = fs.existsSync(testFilePath);
      console.log(`✅ Test file exists: ${exists}`);
      
      // Clean up
      fs.unlinkSync(testFilePath);
      console.log(`✅ Test file cleaned up`);
      
      return true;
    } catch (error) {
      console.log(`❌ Upload test failed: ${error.message}`);
      return false;
    }
  }

  checkImageIntegrity() {
    console.log('\n🔍 CHECKING IMAGE INTEGRITY...');
    
    const results = this.checkUploadDirectories();
    let corruptedFiles = [];
    let totalChecked = 0;

    results.forEach(result => {
      if (result.exists && result.files.length > 0) {
        result.files.forEach(file => {
          totalChecked++;
          try {
            const filePath = path.join(result.path, file.name);
            const stats = fs.statSync(filePath);
            
            if (stats.size === 0) {
              corruptedFiles.push({
                path: filePath,
                issue: 'Zero byte file'
              });
            }
          } catch (error) {
            corruptedFiles.push({
              path: path.join(result.path, file.name),
              issue: error.message
            });
          }
        });
      }
    });

    console.log(`📊 Checked ${totalChecked} image files`);
    
    if (corruptedFiles.length > 0) {
      console.log(`❌ Found ${corruptedFiles.length} problematic files:`);
      corruptedFiles.forEach(file => {
        console.log(`   - ${file.path}: ${file.issue}`);
      });
    } else {
      console.log(`✅ All image files appear to be intact`);
    }

    return corruptedFiles;
  }
}

// Run diagnostics if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostics = new ImageDiagnostics();
  
  console.log('🔍 IMAGE STORAGE DIAGNOSTICS');
  console.log('============================\n');
  
  const report = diagnostics.generateReport();
  await diagnostics.testImageUpload();
  diagnostics.checkImageIntegrity();
  
  console.log('\n📋 RECOMMENDATIONS:');
  console.log('-------------------');
  
  if (report.workingDirectories === 0) {
    console.log('🚨 URGENT: Set up proper upload directory with write permissions');
    console.log('💡 Consider using cloud storage (AWS S3, Cloudinary) for production');
  } else if (report.totalImages === 0) {
    console.log('📸 No images found - upload some test images to verify system');
  } else {
    console.log('✅ Image system appears healthy');
    console.log('💡 Consider implementing regular backup and cleanup routines');
  }
  
  console.log('\n🔗 For production deployments:');
  console.log('• Ensure persistent disk is properly mounted');
  console.log('• Set up image optimization and CDN');
  console.log('• Implement automatic backup system');
  console.log('• Monitor disk space usage');
}

export default ImageDiagnostics;
