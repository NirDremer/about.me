#!/usr/bin/env node

/**
 * Generate a manifest of photos in the public/photos directory
 * This script should be run whenever you add new photos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');
const MANIFEST_PATH = path.join(PHOTOS_DIR, 'manifest.json');

// Image file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

function generateManifest() {
  try {
    // Ensure photos directory exists
    if (!fs.existsSync(PHOTOS_DIR)) {
      fs.mkdirSync(PHOTOS_DIR, { recursive: true });
      console.log('Created photos directory:', PHOTOS_DIR);
    }

    // Read all files in the photos directory
    const files = fs.readdirSync(PHOTOS_DIR);
    
    // Filter for image files only (excluding manifest.json)
    const photoFiles = files.filter(file => 
      isImageFile(file) && file !== 'manifest.json'
    );

    // Sort files by name (which should sort by timestamp if named correctly)
    photoFiles.sort();

    // Create manifest object
    const manifest = {
      photos: photoFiles,
      generated: new Date().toISOString(),
      count: photoFiles.length
    };

    // Write manifest file
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    console.log(`Generated manifest with ${photoFiles.length} photos:`);
    photoFiles.forEach(file => console.log(`  - ${file}`));
    console.log(`Manifest saved to: ${MANIFEST_PATH}`);

  } catch (error) {
    console.error('Error generating manifest:', error);
    process.exit(1);
  }
}

// Run the script
generateManifest();