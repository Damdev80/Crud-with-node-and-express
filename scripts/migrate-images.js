#!/usr/bin/env node

// Script para migrar imágenes existentes al nuevo sistema de gestión
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ImageMigration {
  constructor() {
    this.oldUploadDir = path.join(__dirname, '../server/uploads');
    this.newUploadDir = process.env.UPLOAD_DIR || this.oldUploadDir;
    this.backupDir = path.join(__dirname, '../backup/images');
  }

  async createBackup() {
    console.log('📦 Creating backup of existing images...');
    
    if (!fs.existsSync(this.oldUploadDir)) {
      console.log('❌ No existing upload directory found');
      return false;
    }

    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    try {
      const files = fs.readdirSync(this.oldUploadDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      console.log(`📸 Found ${imageFiles.length} image files to backup`);
      
      for (const file of imageFiles) {
        const sourcePath = path.join(this.oldUploadDir, file);
        const backupPath = path.join(this.backupDir, file);
        
        fs.copyFileSync(sourcePath, backupPath);
        console.log(`✅ Backed up: ${file}`);
      }
      
      // Create backup manifest
      const manifest = {
        backupDate: new Date().toISOString(),
        totalFiles: imageFiles.length,
        files: imageFiles.map(file => ({
          name: file,
          originalPath: path.join(this.oldUploadDir, file),
          backupPath: path.join(this.backupDir, file),
          size: fs.statSync(path.join(this.oldUploadDir, file)).size
        }))
      };
      
      fs.writeFileSync(
        path.join(this.backupDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      console.log(`✅ Backup completed: ${imageFiles.length} files`);
      console.log(`📁 Backup location: ${this.backupDir}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Backup failed: ${error.message}`);
      return false;
    }
  }

  async migrateImages() {
    console.log('🔄 Migrating images to new system...');
    
    // If source and destination are the same, no migration needed
    if (this.oldUploadDir === this.newUploadDir) {
      console.log('✅ Source and destination are the same - no migration needed');
      return true;
    }

    try {
      // Create new upload directory if it doesn't exist
      if (!fs.existsSync(this.newUploadDir)) {
        fs.mkdirSync(this.newUploadDir, { recursive: true });
        console.log(`📁 Created new upload directory: ${this.newUploadDir}`);
      }

      const files = fs.readdirSync(this.oldUploadDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      console.log(`📸 Migrating ${imageFiles.length} image files...`);
      
      for (const file of imageFiles) {
        const sourcePath = path.join(this.oldUploadDir, file);
        const destPath = path.join(this.newUploadDir, file);
        
        // Only copy if destination doesn't exist or is different
        if (!fs.existsSync(destPath) || 
            fs.statSync(sourcePath).size !== fs.statSync(destPath).size) {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`✅ Migrated: ${file}`);
        } else {
          console.log(`⏭️ Skipped (already exists): ${file}`);
        }
      }
      
      console.log(`✅ Migration completed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Migration failed: ${error.message}`);
      return false;
    }
  }

  async verifyMigration() {
    console.log('🔍 Verifying migration...');
    
    try {
      const oldFiles = fs.existsSync(this.oldUploadDir) 
        ? fs.readdirSync(this.oldUploadDir).filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        : [];
      
      const newFiles = fs.existsSync(this.newUploadDir)
        ? fs.readdirSync(this.newUploadDir).filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        : [];
      
      console.log(`📊 Original directory: ${oldFiles.length} files`);
      console.log(`📊 New directory: ${newFiles.length} files`);
      
      const missingFiles = oldFiles.filter(file => !newFiles.includes(file));
      
      if (missingFiles.length > 0) {
        console.log(`❌ Missing files in new directory:`);
        missingFiles.forEach(file => console.log(`   - ${file}`));
        return false;
      } else {
        console.log(`✅ All files successfully migrated`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Verification failed: ${error.message}`);
      return false;
    }
  }

  async cleanupOldFiles() {
    console.log('🧹 Cleaning up old files...');
    
    if (this.oldUploadDir === this.newUploadDir) {
      console.log('✅ No cleanup needed - same directory');
      return true;
    }

    const answer = await this.prompt('Are you sure you want to delete old image files? (y/N): ');
    
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Cleanup cancelled by user');
      return false;
    }

    try {
      const files = fs.readdirSync(this.oldUploadDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      for (const file of imageFiles) {
        const filePath = path.join(this.oldUploadDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted: ${file}`);
      }
      
      console.log(`✅ Cleanup completed: ${imageFiles.length} files deleted`);
      return true;
    } catch (error) {
      console.error(`❌ Cleanup failed: ${error.message}`);
      return false;
    }
  }

  async prompt(question) {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }

  async generateReport() {
    console.log('\n📋 MIGRATION REPORT');
    console.log('==================');
    
    const oldExists = fs.existsSync(this.oldUploadDir);
    const newExists = fs.existsSync(this.newUploadDir);
    
    console.log(`Old directory (${this.oldUploadDir}): ${oldExists ? '✅' : '❌'}`);
    console.log(`New directory (${this.newUploadDir}): ${newExists ? '✅' : '❌'}`);
    
    if (oldExists) {
      const oldFiles = fs.readdirSync(this.oldUploadDir)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      console.log(`Old directory files: ${oldFiles.length}`);
    }
    
    if (newExists) {
      const newFiles = fs.readdirSync(this.newUploadDir)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      console.log(`New directory files: ${newFiles.length}`);
    }
    
    console.log(`Backup directory: ${fs.existsSync(this.backupDir) ? '✅' : '❌'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Upload directory env: ${process.env.UPLOAD_DIR || 'not set'}`);
  }
}

// Run migration if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new ImageMigration();
  
  console.log('🔄 STARTING IMAGE MIGRATION');
  console.log('===========================\n');
  
  try {
    // Step 1: Create backup
    const backupSuccess = await migration.createBackup();
    
    if (!backupSuccess) {
      console.log('❌ Migration aborted due to backup failure');
      process.exit(1);
    }
    
    // Step 2: Migrate images
    const migrationSuccess = await migration.migrateImages();
    
    if (!migrationSuccess) {
      console.log('❌ Migration failed');
      process.exit(1);
    }
    
    // Step 3: Verify migration
    const verificationSuccess = await migration.verifyMigration();
    
    if (!verificationSuccess) {
      console.log('❌ Migration verification failed');
      process.exit(1);
    }
    
    // Step 4: Generate report
    await migration.generateReport();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n🔗 Next steps:');
    console.log('1. Test image uploads in the application');
    console.log('2. Verify images display correctly');
    console.log('3. Run cleanup script if everything works');
    
  } catch (error) {
    console.error(`❌ Migration failed with error: ${error.message}`);
    process.exit(1);
  }
}

export default ImageMigration;
