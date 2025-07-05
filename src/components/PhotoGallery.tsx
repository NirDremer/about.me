import React, { useState, useEffect, useCallback } from 'react';
import { LazyImage } from './LazyImage';
import { Photo, loadAllPhotos } from '../utils/imageLoader';

interface PhotoGalleryProps {
  excludeFirst?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ excludeFirst = false }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        const allPhotos = await loadAllPhotos();
        console.log('Loaded photos:', allPhotos.length);
        
        // Exclude the first photo if it's being used as hero background and we have photos
        const photosToShow = excludeFirst && allPhotos.length > 0 
          ? allPhotos.slice(1) 
          : allPhotos;
        
        console.log('Photos to show:', photosToShow.length);
        setPhotos(photosToShow);
      } catch (err) {
        setError('Failed to load photos from manifest');
        console.error('Error loading photos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [excludeFirst]);

  const handleImageLoad = useCallback(() => {
    setLoadedCount(prev => prev + 1);
  }, []);

  const handleImageLoadWithAspectRatio = useCallback((photoId: string, img: HTMLImageElement) => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageAspectRatios(prev => ({
      ...prev,
      [photoId]: aspectRatio
    }));
    handleImageLoad();
  }, [handleImageLoad]);

  // Calculate if image should have limited width based on aspect ratio
  const getImageContainerClass = (photoId: string) => {
    const aspectRatio = imageAspectRatios[photoId];
    if (!aspectRatio) return 'w-full';
    
    // If height is more than 120% of screen height (aspect ratio < 0.83), limit width
    // 0.83 = 1 / 1.2 (inverse of 120%)
    if (aspectRatio < 0.83) {
      return 'max-w-4xl mx-auto';
    }
    
    return 'w-full';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading photos</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      null
    );
  }

  return (
    <main className="relative">
      {photos.map((photo, index) => (
        <article key={photo.id} className="relative group">
          {/* Photo Container */}
          <div className={`relative overflow-hidden ${getImageContainerClass(photo.id)}`}>
            <LazyImage
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-102 block"
              loading="lazy"
              onLoad={(img) => handleImageLoadWithAspectRatio(photo.id, img)}
            />
            
            {/* Date Overlay - Left Aligned */}
            <div className="absolute bottom-0 left-0 p-4 sm:p-8 z-10">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-700 ease-out">
                <div className="text-white/30">
                  <span className="text-sm sm:text-base font-light opacity-30">{photo.date}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </main>
  );
};