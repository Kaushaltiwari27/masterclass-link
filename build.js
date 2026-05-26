const fs = require('fs');
const path = require('path');

// 1. Resolve Meta Pixel ID from Environment Variables
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

if (!pixelId) {
  console.log('[Build] NEXT_PUBLIC_META_PIXEL_ID is not set in environment. Skipping replacement (using default placeholders).');
  process.exit(0);
}

console.log(`[Build] Found NEXT_PUBLIC_META_PIXEL_ID: ${pixelId}. Processing files...`);

// Files to process
const configPath = path.join(__dirname, 'meta-pixel-config.js');
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'admin.html'),
  path.join(__dirname, 'settings.html')
];

// 2. Overwrite meta-pixel-config.js
if (fs.existsSync(configPath)) {
  let content = fs.readFileSync(configPath, 'utf8');
  // Replace the default value placeholder with the env variable value
  content = content.replace(/window\.NEXT_PUBLIC_META_PIXEL_ID\s*=\s*["'](?:YOUR_PIXEL_ID|740056559170783)["']/g, `window.NEXT_PUBLIC_META_PIXEL_ID = "${pixelId}"`);
  fs.writeFileSync(configPath, content, 'utf8');
  console.log('[Build] Successfully injected Pixel ID into meta-pixel-config.js');
} else {
  console.warn('[Build] meta-pixel-config.js not found!');
}

// 3. Replace in HTML files for noscript tags
htmlFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace the noscript pixel tracker URL query param
    const originalLength = content.length;
    content = content.replace(/tr\?id=(?:YOUR_PIXEL_ID|740056559170783)&/g, `tr?id=${pixelId}&`);
    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[Build] Successfully injected Pixel ID into <noscript> tags in ${path.basename(filePath)}`);
    } else {
      console.log(`[Build] No placeholder 'YOUR_PIXEL_ID' or '740056559170783' found in <noscript> tags for ${path.basename(filePath)} (or already replaced)`);
    }
  } else {
    console.warn(`[Build] File not found: ${path.basename(filePath)}`);
  }
});

console.log('[Build] Project build and injection complete.');
