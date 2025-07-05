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

// Common image file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];

// Function to check if a file is an image
const isImageFile = (filename: string): boolean => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return IMAGE_EXTENSIONS.includes(ext);
};

// Parse timestamp from filename (YYYYMMDD-HH-MM-SS format)
const parseTimestampFromFilename = (filename: string): Date | null => {
  // Match YYYYMMDD-HH-MM-SS pattern at the start of filename
  const timestampMatch = filename.match(/^(\d{4})(\d{2})(\d{2})-(\d{2})-(\d{2})-(\d{2})/);
  
  if (!timestampMatch) {
    return null;
  }

  const [, year, month, day, hour, minute, second] = timestampMatch;
  
  // Create date object (month is 0-indexed in JavaScript)
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );

  // Validate the date
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// Extract location/description from filename after timestamp
const extractLocationFromFilename = (filename: string): string => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|gif|bmp|tiff)$/i, '');
  
  // Remove timestamp prefix (YYYYMMDD-HH-MM-SS)
  const withoutTimestamp = nameWithoutExt.replace(/^\d{8}-\d{2}-\d{2}-\d{2}-?/, '');
  
  if (!withoutTimestamp) {
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
    console.log('Loading photo manifest...');
    const response = await fetch('/photos/manifest.json');
    if (!response.ok) {
      console.warn('Failed to load manifest:', response.status, response.statusText);
      return { photos: [], success: false };
    }
    const manifest = await response.json();
    console.log('Loaded manifest:', manifest);
    return { photos: manifest.photos || [], success: true };
  } catch (error) {
    console.error('Error loading photo manifest:', error);
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
      
      if (!fileDate) {
        console.warn(`Could not parse timestamp from filename: ${filename}, skipping`);
        continue;
      }

      const location = extractLocationFromFilename(filename);
      const title = generateTitleFromFilename(filename);
      const imagePath = '/photos/' + filename;
      
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
        fileDate
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