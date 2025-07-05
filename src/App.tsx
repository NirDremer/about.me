import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { PhotoGallery } from './components/PhotoGallery';
import { loadAllPhotos } from './utils/imageLoader';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [heroImage, setHeroImage] = useState<string>('');
  const [hasPhotos, setHasPhotos] = useState<boolean>(false);

  // Get the base path for assets
  const getBasePath = (): string => {
    // No base path needed when using custom domain
    return '';
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const photos = await loadAllPhotos();
        if (photos.length > 0) {
          // Use the first (newest) photo from manifest as hero background
          setHeroImage(photos[0].src);
          setHasPhotos(true);
        } else {
          // Use default background when no photos found in manifest
          const basePath = getBasePath();
          setHeroImage(`${basePath}/bg.jpg`);
          setHasPhotos(false);
        }
      } catch (error) {
        console.error('Error loading hero image:', error);
        // Fallback to default background on error
        const basePath = getBasePath();
        setHeroImage(`${basePath}/bg.jpg`);
        setHasPhotos(false);
      }
    };

    loadHeroImage();
  }, []);

  // Calculate header transform based on scroll
  const headerTransform = Math.min(scrollY * 0.8, 400); // Max 400px upward movement
  const headerOpacity = Math.max(1 - scrollY / 300, 0); // Fade out over 300px
  
  // Calculate sticky header visibility
  const showStickyHeader = scrollY > 400;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        showStickyHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-light tracking-wide text-white">
                  NIR DREMER
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <a 
                  href="mailto:hey@dremer.net" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com/nird" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/dremer/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com/NirDremer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {heroImage && (
            <img 
              src={heroImage}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Header Content Overlay */}
        <header 
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            transform: `translateY(-${headerTransform}px)`,
            opacity: headerOpacity
          }}
        >
          <div className="text-center px-4 sm:px-6">
            {/* Blur backdrop for text */}
            <div className="backdrop-blur-md bg-black/20 rounded-3xl p-8 sm:p-12 border border-white/10">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-thin tracking-wide text-white mb-4 sm:mb-6">
                NIR DREMER
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-light text-gray-200 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
                PRODUCT BUILDER, INVESTOR, FAMILY GUY & AMATEUR PHOTOGRAPHER
              </p>
              
              {/* Contact Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <a 
                  href="mailto:hey@dremer.net" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base group"
                >
                  <Mail className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
                  <span>hey@dremer.net</span>
                </a>
                <a 
                  href="https://twitter.com/nird" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base group"
                >
                  <Twitter className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
                  <span>@nird</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/dremer/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base group"
                >
                  <Linkedin className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/NirDremer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base group"
                >
                  <Github className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
                  <span>GitHub</span>
                </a>
                <div className="flex items-center text-gray-300 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Belmont, CA</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scroll indicator */}
      </div>

      {/* Photo Gallery */}
      {hasPhotos && <PhotoGallery excludeFirst={true} />}

      {/* Footer */}
      <footer className="bg-black/95 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center">
          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <a 
              href="mailto:hey@dremer.net" 
              className="text-gray-400 hover:text-white transition-colors duration-300 group"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://twitter.com/nird" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 group"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://www.linkedin.com/in/dremer/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://github.com/NirDremer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
          
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nir Dremer
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;