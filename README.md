# Photography Portfolio

A beautiful, responsive photography portfolio built with React, TypeScript, and Tailwind CSS. Designed to showcase photos with automatic timestamp parsing and elegant presentation.

## Features

- **Responsive Design**: Looks great on all devices
- **Automatic Photo Loading**: Reads photos from `/public/photos/` directory
- **Timestamp Parsing**: Automatically extracts date/time from filename format `YYYYMMDD-HH-MM-SS-description`
- **Lazy Loading**: Optimized image loading for better performance
- **GitHub Pages Ready**: Configured for easy deployment to GitHub Pages

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your photos**
   - Place your photos in the `public/photos/` directory
   - Name them using the format: `YYYYMMDD-HH-MM-SS-description.jpg`
   - Example: `20241215-14-30-45-Switzerland_Alps_Sunset.jpg`

4. **Generate photo manifest**
   ```bash
   npm run photos
   ```

5. **Run locally**
   ```bash
   npm run dev
   ```

## Photo Naming Convention

Photos should be named using this format:
```
YYYYMMDD-HH-MM-SS-description.extension
```

Examples:
- `20241215-14-30-45-Switzerland_Alps_Sunset.jpg`
- `20241210-09-15-22-BigSur_California_Coastline.jpg`
- `20241205-16-45-10-Vermont_Forest_Autumn.jpg`

The system will automatically:
- Parse the timestamp for sorting (newest first)
- Extract the description for display
- Format the date for presentation

## Deployment to GitHub Pages

### Automatic Deployment

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Push to main branch**
   - The GitHub Action will automatically build and deploy your site
   - Your site will be available at `https://yourusername.github.io/repository-name`

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## Customization

### Personal Information
Edit `src/App.tsx` to update:
- Name and title
- Contact information
- Social media links
- Location

### Styling
- The project uses Tailwind CSS for styling
- Main styles are in `src/index.css`
- Component-specific styles are inline with Tailwind classes

### Default Background
- Place a default background image at `public/bg.jpg`
- This will be used when no photos are found

## File Structure

```
├── public/
│   ├── photos/           # Your photo files go here
│   │   └── manifest.json # Auto-generated photo list
│   └── bg.jpg           # Default background image
├── src/
│   ├── components/      # React components
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main application
├── scripts/
│   └── generate-manifest.js # Photo manifest generator
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run photos` - Generate photo manifest
- `npm run preview` - Preview production build

## License

MIT License - feel free to use this for your own photography portfolio!