const fs = require('fs');
const path = require('path');

// 1. Setup paths
const srcDir = __dirname;
const destDir = path.join(__dirname, 'public');

console.log('[Build] Starting build process...');

// Create destination directory
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

// Files to copy
const filesToCopy = [
  'index.html',
  'admin.html',
  'settings.html',
  'style.css',
  'app.js',
  'meta-pixel-config.js',
  'meta-pixel.js',
  'about_learning_ready.png',
  'bonuses_mockup_gifts.png',
  'curriculum_day1_basics.png',
  'curriculum_day2_agents.png',
  'hero_ai_innovation.png',
  'logo.png',
  'logo.svg'
];

// Copy files
filesToCopy.forEach(file => {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`[Build] Copied ${file} to public/`);
  } else {
    console.warn(`[Build] Warning: Source file ${file} does not exist.`);
  }
});

// 2. Resolve Meta Pixel ID from Environment Variables
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

if (!pixelId) {
  console.log('[Build] NEXT_PUBLIC_META_PIXEL_ID is not set in environment. Using default placeholders in public/ folder.');
  process.exit(0);
}

console.log(`[Build] Found NEXT_PUBLIC_META_PIXEL_ID: ${pixelId}. Processing files in public/...`);

// Config path in public folder
const configPathInPublic = path.join(destDir, 'meta-pixel-config.js');
if (fs.existsSync(configPathInPublic)) {
  let content = fs.readFileSync(configPathInPublic, 'utf8');
  content = content.replace(/window\.NEXT_PUBLIC_META_PIXEL_ID\s*=\s*["'](?:YOUR_PIXEL_ID|740056559170783)["']/g, `window.NEXT_PUBLIC_META_PIXEL_ID = "${pixelId}"`);
  fs.writeFileSync(configPathInPublic, content, 'utf8');
  console.log('[Build] Successfully injected Pixel ID into public/meta-pixel-config.js');
}

// HTML paths in public folder
const htmlFilesInPublic = [
  path.join(destDir, 'index.html'),
  path.join(destDir, 'admin.html'),
  path.join(destDir, 'settings.html')
];

htmlFilesInPublic.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;
    content = content.replace(/tr\?id=(?:YOUR_PIXEL_ID|740056559170783)&/g, `tr?id=${pixelId}&`);
    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[Build] Successfully injected Pixel ID into <noscript> tags in public/${path.basename(filePath)}`);
    }
  }
});

console.log('[Build] Project build and injection complete in public/ folder.');
