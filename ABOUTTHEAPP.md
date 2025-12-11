# Xelon Release Builder

A professional music release metadata submission tool built with React and TypeScript. This application streamlines the process of preparing music releases by collecting comprehensive metadata, managing artwork and audio assets, and exporting everything in industry-standard formats.

## Features

### Core Functionality

- **3-Step Workflow**: Intuitive process flow for release submission
  - Step 1: Release Information & Artwork
  - Step 2: Track Details & Audio Files
  - Step 3: Export & Download

- **Comprehensive Metadata Management**
  - Release-level metadata (title, artists, label, catalog number, UPC, etc.)
  - Track-level metadata (title, ISRC, genre, language, explicit content, etc.)
  - Advanced credits system (performers, composers, producers with role assignment)
  - Featured artists and remixer support
  - Publisher information

- **Asset Management**
  - Artwork upload with drag-and-drop support (3000x3000 RGB JPG)
  - Audio file upload (WAV format, minimum 16-bit 44.1kHz)
  - Dolby Atmos support
  - Configurable mandatory/optional validation modes

- **Genre Selection**
  - Hierarchical genre taxonomy
  - Selection at any tier level (primary, secondary, or tertiary)
  - Separate album and track genre assignment

- **Territory Management**
  - Worldwide distribution option
  - Include/exclude territory modes
  - Multi-territory selection support

- **Import/Export**
  - Import existing releases from ZIP files
  - Export to Excel format (.xlsx)
  - Export complete packages with artwork and audio files
  - ZIP bundle creation for submission

- **User Experience**
  - Dark mode support with system preference detection
  - Real-time validation with clear error messaging
  - Form state persistence across navigation
  - Responsive design for all screen sizes
  - Copy track functionality for multi-track releases

## Tech Stack

### Core Technologies
- **React 18.3** - UI framework
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool and dev server
- **React Router 6.26** - Navigation

### UI & Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### Form Management
- **React Hook Form 7.53** - Form handling
- **Zod 3.23** - Schema validation
- **@hookform/resolvers** - Validation integration

### Additional Libraries
- **ExcelJS 4.4** - Excel file generation
- **JSZip 3.10** - ZIP file creation and extraction
- **date-fns 3.6** - Date manipulation
- **sonner** - Toast notifications
- **@tanstack/react-query** - Data fetching

## Getting Started

### Prerequisites

- Node.js 16+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FormNovember-main07112025
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure asset validation mode in `.env`:
```env
# For development (optional uploads):
VITE_ASSETS_MANDATORY=false

# For production (required uploads):
VITE_ASSETS_MANDATORY=true
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Development build (for debugging)
npm run build:dev
```

## Usage

### Creating a New Release

1. **Release Information (Step 1)**
   - Enter release title and mix version (optional)
   - Add primary artists, featured artists, and remixers
   - Set release date and handle re-release information
   - Upload release artwork (3000x3000 RGB JPG)
   - Select album genre from hierarchical taxonomy
   - Enter label information and catalog numbers
   - Set copyright information (C-line and P-line)
   - Configure territory distribution

2. **Track Details (Step 2)**
   - Add tracks to your release
   - For each track:
     - Enter track title and mix version
     - Upload audio file (WAV, 16-bit 44.1kHz minimum)
     - Configure track-specific artists and remixers
     - Assign performers with roles (vocalist, guitarist, etc.)
     - Assign composers and producers with roles
     - Add publisher information
     - Select track genre
     - Set language and explicit content flags
     - Add ISRC codes
     - Enable Dolby Atmos if applicable
     - Optionally add lyrics
   - Use "Copy Track" to duplicate settings for similar tracks

3. **Export (Step 3)**
   - Review all entered information
   - Validate that all required fields are complete
   - Download as Excel (.xlsx) for metadata review
   - Download complete ZIP package with all assets

### Importing Existing Releases

Click "Import from ZIP" on Step 1 to import a previously exported release package. The system will automatically populate all fields with the imported data.

## Configuration

### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `VITE_ASSETS_MANDATORY` | `true` / `false` | `true` | Controls whether artwork and audio uploads are required |

### Asset Validation Modes

**Mandatory Mode** (`VITE_ASSETS_MANDATORY=true`):
- Artwork must be uploaded before proceeding from Step 1
- All tracks must have audio files before proceeding from Step 2
- Visual indicators show missing assets
- Export is blocked if assets are missing
- Recommended for production environments

**Optional Mode** (`VITE_ASSETS_MANDATORY=false`):
- All uploads are optional
- Users can navigate freely without assets
- No validation warnings appear
- Useful for development and testing
- Allows metadata-only workflows

For detailed information, see [ASSET_VALIDATION.md](./ASSET_VALIDATION.md)

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development (with sourcemaps)
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
FormNovember-main07112025/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── track/           # Track-specific components
│   │   ├── ReleaseInfo.tsx  # Step 1 component
│   │   ├── TrackDetails.tsx # Step 2 component
│   │   ├── ExportStep.tsx   # Step 3 component
│   │   ├── GenreSelector.tsx
│   │   ├── ImportFromZip.tsx
│   │   └── ...
│   ├── lib/                 # Utility libraries
│   │   ├── assetValidation.ts
│   │   ├── importUtils.ts
│   │   └── utils.ts
│   ├── pages/               # Page components
│   │   └── Index.tsx        # Main application
│   ├── App.tsx              # Root component
│   └── main.tsx            # Application entry point
├── public/                  # Static assets
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md
```

### Key Components

- **Index.tsx** - Main application with step navigation and state management
- **ReleaseInfo.tsx** - Release-level metadata and artwork upload
- **TrackDetails.tsx** - Track list management and track form orchestration
- **TrackForm.tsx** - Individual track metadata form
- **ExportStep.tsx** - Validation and export functionality
- **GenreSelector.tsx** - Hierarchical genre selection component
- **ImportFromZip.tsx** - ZIP import functionality

### Adding New Features

1. Follow existing component patterns and TypeScript interfaces
2. Use shadcn/ui components for consistent styling
3. Implement validation using Zod schemas and React Hook Form
4. Add new fields to `ReleaseData` or `TrackData` interfaces in `Index.tsx`
5. Update import/export logic in respective utilities
6. Maintain accessibility standards (ARIA labels, keyboard navigation)

## Documentation

- [ASSET_VALIDATION.md](./ASSET_VALIDATION.md) - Detailed asset validation system documentation
- [QUICK_START.md](./QUICK_START.md) - Quick start guide for asset validation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical implementation details
- [LOVABLE-README.md](./LOVABLE-README.md) - Lovable platform integration guide

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- File uploads are client-side only (no server storage)
- No real-time collaboration features
- Audio file format validation is basic (no deep format analysis)
- Image dimension validation not implemented
- Maximum file sizes not enforced

## Future Enhancements

Potential improvements for future versions:

- Server-side storage and persistence
- Advanced audio file validation (sample rate, bit depth verification)
- Image dimension and format validation
- Batch import for multiple releases
- Template system for recurring release patterns
- API integration for direct submission to distributors
- Collaborative editing features
- Audio preview/playback
- Metadata auto-population from uploaded files
- ISRC generator integration

## License

This project was created with [Lovable](https://lovable.dev) and is available for modification and distribution.

## Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
