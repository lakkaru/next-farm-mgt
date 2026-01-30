/**
 * Script to copy translation files from Gatsby frontend to Next.js project
 * Run from the next-farm-mgt directory:
 * node scripts/copy-translations.js
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../frontend/src/i18n/locales');
const targetDir = path.join(__dirname, '../src/i18n/locales');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = ['en.json', 'si.json'];

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.log(`❌ Source file not found: ${sourcePath}`);
  }
});

console.log('\n📦 Translation files copied successfully!');
