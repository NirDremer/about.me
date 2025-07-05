export interface Photo {
  id: string;
  src: string;
  alt: string;
  title: string;
  location: string;
  date: string;
  description: string;
  overlayText?: string;
  fileName: string;
  fileDate: Date;
}

// Get the base path for assets
const getBasePath = (): string => {
  // Always use the base path for GitHub Pages
  return '/about.me';
};

// Common image file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];

// Function to check if a file is an image
const isImageFile = (filename: string): boolean => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return IMAGE_EXTENSIONS.includes(ext);
};

// Parse timestamp from filename (YYYYMMDD-HH-MM-SS format)
const parseTimestampFromFilename = (filename: string): Date | null => {
  // Try multiple timestamp patterns
  
  // Pattern 1: YYYYMMDD-HH-MM-SS (original format)
  let timestampMatch = filename.match(/^(\d{4})(\d{2})(\d{2})-(\d{2})-(\d{2})-(\d{2})/);
  
  if (timestampMatch) {
    const [, year, month, day, hour, minute, second] = timestampMatch;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
    if (!isNaN(date.getTime())) return date;
  }
  
  // Pattern 2: YYYYMMDD-XXXXXXX (like 20250615-A7C00863.jpg)
  timestampMatch = filename.match(/^(\d{4})(\d{2})(\d{2})-/);
  
  if (timestampMatch) {
    const [, year, month, day] = timestampMatch;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      12, 0, 0 // Default to noon
    );
    if (!isNaN(date.getTime())) return date;
  }
  
  // Pattern 3: DD-MM-YY_HHMMSS (like 07-09-23_121056)
  timestampMatch = filename.match(/^(\d{2})-(\d{2})-(\d{2})_(\d{2})(\d{2})(\d{2})/);
  
  if (timestampMatch) {
    const [, day, month, year, hour, minute, second] = timestampMatch;
    // Assume 20xx for 2-digit years
    const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
    const date = new Date(
      fullYear,
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
    if (!isNaN(date.getTime())) return date;
  }

  // If no timestamp pattern matches, return current date as fallback
  console.warn(`Could not parse timestamp from filename: ${filename}, using current date`);
  return new Date();
};

// Extract location/description from filename after timestamp
const extractLocationFromFilename = (filename: string): string => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|gif|bmp|tiff)$/i, '');
  
  // Remove various timestamp prefixes
  let withoutTimestamp = nameWithoutExt
    .replace(/^\d{8}-\d{2}-\d{2}-\d{2}-?/, '') // YYYYMMDD-HH-MM-SS
    .replace(/^\d{8}-[A-Z0-9]+/, '') // YYYYMMDD-XXXXXXX
    .replace(/^\d{2}-\d{2}-\d{2}_\d{6}_-_/, ''); // DD-MM-YY_HHMMSS_-_
  
  if (!withoutTimestamp) {
    // If no description after timestamp, try to extract meaningful parts
    if (nameWithoutExt.includes('Croatia') || nameWithoutExt.includes('Slovenia')) {
      return 'Croatia Slovenia Vacation';
    }
    if (nameWithoutExt.includes('A7C')) {
      return 'Photography';
    }
    return 'Photo';
  }

  // Replace underscores and hyphens with spaces, clean up
  const cleaned = withoutTimestamp
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned || 'Photo';
};

// Generate a title from filename
const generateTitleFromFilename = (filename: string): string => {
  const location = extractLocationFromFilename(filename);
  return location;
};

// Format date for display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time for display
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Load photo manifest with better error handling
const loadPhotoManifest = async (): Promise<{ photos: string[], success: boolean }> => {
  try {
    console.log('Loading photo manifest from:', `${getBasePath()}/photos/manifest.json`);
    const basePath = getBasePath();
    const response = await fetch(`${basePath}/photos/manifest.json`);
    if (!response.ok) {
      console.warn('Failed to load manifest:', response.status, response.statusText, 'URL:', `${basePath}/photos/manifest.json`);
      return { photos: [], success: false };
    }
    const manifest = await response.json();
    console.log('Loaded manifest successfully:', manifest);
    return { photos: manifest.photos || [], success: true };
  } catch (error) {
    console.error('Error loading photo manifest from:', `${getBasePath()}/photos/manifest.json`, error);
    return { photos: [], success: false };
  }
};

// Get list of photo files from manifest
const getPhotoFiles = async (): Promise<string[]> => {
  try {
    const { photos: manifestPhotos, success } = await loadPhotoManifest();
    
    if (!success) {
      console.log('Manifest loading failed, returning empty array');
      return [];
    }
    
    const imageFiles = manifestPhotos.filter(filename => isImageFile(filename));
    console.log('Filtered image files:', imageFiles);
    return imageFiles;
  } catch (error) {
    console.error('Error loading photos from manifest:', error);
    return [];
  }
};

// Load images from the photos folder
export const loadPhotosFromRepo = async (): Promise<Photo[]> => {
  try {
    const photoFiles = await getPhotoFiles();
    
    if (photoFiles.length === 0) {
      console.log('No photos found in manifest or manifest is empty.');
      return [];
    }

    console.log(`Found ${photoFiles.length} photos:`, photoFiles);
    const photos: Photo[] = [];

    for (const filename of photoFiles) {
      if (!isImageFile(filename)) continue;

      // Parse timestamp from filename
      const fileDate = parseTimestampFromFilename(filename);
      
      const location = extractLocationFromFilename(filename);
      const title = generateTitleFromFilename(filename);
      const basePath = getBasePath();
      const imagePath = `${basePath}/photos/${filename}`;
      
      console.log(`Processing photo: ${filename} -> ${imagePath}`);
      
      photos.push({
        id: filename,
        src: imagePath,
        alt: `${title}`,
        title,
        location,
        date: formatDate(fileDate),
        description: `Captured on ${formatDate(fileDate)} at ${formatTime(fileDate)}`,
        overlayText: location,
        fileName: filename,
        fileDate: fileDate || new Date()
      });
    }

    // Sort by timestamp (newest first)
    const sortedPhotos = photos.sort((a, b) => b.fileDate.getTime() - a.fileDate.getTime());
    console.log('Final sorted photos:', sortedPhotos.map(p => ({ id: p.id, src: p.src })));
    return sortedPhotos;

  } catch (error) {
    console.error('Error loading photos from manifest:', error);
    return [];
  }
};

// Main function to load all photos
export const loadAllPhotos = async (): Promise<Photo[]> => {
  return await loadPhotosFromRepo();
};