# Asset Validation System

## Overview

This application includes a comprehensive validation system that can make artwork and audio file uploads mandatory before users can progress through the workflow or submit/export their work. The system is controlled by an environment variable to allow toggling between mandatory and optional modes across different environments.

## Environment Configuration

### Setup

The asset validation behavior is controlled by the `VITE_ASSETS_MANDATORY` environment variable:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` to configure the validation mode:
   ```env
   # Set to 'true' to make artwork and audio files mandatory
   # Set to 'false' to make uploads optional
   VITE_ASSETS_MANDATORY=true
   ```

### Modes

- **Mandatory Mode** (`VITE_ASSETS_MANDATORY=true`):
  - Artwork upload is required on Step 1 (Release Info)
  - Audio file uploads are required on Step 2 (Track Details)
  - Users cannot proceed to the next step without uploading required assets
  - Export/Download functionality is blocked if assets are missing
  - Visual indicators show which assets are missing

- **Optional Mode** (`VITE_ASSETS_MANDATORY=false`):
  - Artwork and audio uploads are optional
  - Users can progress through all steps without uploading files
  - No validation warnings or visual indicators appear
  - Export/Download works regardless of asset presence

### Default Behavior

If the environment variable is not set or is undefined, the system defaults to **Mandatory Mode** (`true`) for safety.

## Features

### 1. Step Navigation Validation

Users cannot advance from:
- **Step 1** without uploading release artwork (when mandatory)
- **Step 2** without uploading audio files for all tracks (when mandatory)

### 2. Export/Download Validation

The "Download Zip" button on the Export step is disabled when:
- Release artwork is missing (when mandatory)
- Any track is missing an audio file (when mandatory)
- Other required metadata fields are incomplete

### 3. Visual Indicators

When assets are mandatory and missing:

#### Artwork Upload (Release Info)
- Label shows a red asterisk (*)
- Upload area has orange border and background
- AlertCircle icon appears instead of Upload icon
- Warning message: "Artwork is required to proceed"

#### Audio Upload (Track Details)
- Label shows a red asterisk (*)
- Upload area has orange border and background
- AlertCircle icon appears instead of Upload icon
- Warning message: "Audio file is required to proceed"

#### Navigation Area
- Orange warning banner appears above navigation buttons
- Shows specific error: "Please upload release artwork to continue"
- Or: "Track X is missing an audio file" / "Tracks X, Y, Z are missing audio files"

### 4. Validation Status Card (Export Step)

The Export step shows a validation status card that lists all issues including:
- Missing artwork
- Missing audio files (with specific track numbers)
- Missing metadata fields

## Implementation Details

### Core Validation Module

Located at: `/src/lib/assetValidation.ts`

Key functions:
- `areAssetsMandatory()`: Checks environment variable
- `validateArtwork(releaseData)`: Validates artwork presence
- `validateAudioFiles(tracks)`: Validates all track audio files
- `validateAllAssets(releaseData, tracks)`: Complete validation
- `getAssetValidationMessage()`: Generates user-friendly error messages

### Modified Components

1. **Index.tsx** (Main workflow)
   - Integrates validation into step progression logic
   - Displays validation warnings
   - Disables "Next" button when validation fails

2. **ExportStep.tsx**
   - Adds asset validation to export checks
   - Blocks download when assets are missing

3. **ReleaseInfo.tsx**
   - Shows visual indicators for missing artwork
   - Orange border and warning message when mandatory

4. **TrackMetadataSection.tsx**
   - Shows visual indicators for missing audio files
   - Orange border and warning message when mandatory

## Development vs Production

### Development Environment
Set in `.env`:
```env
VITE_ASSETS_MANDATORY=false
```

Benefits:
- Faster testing without uploading large files
- Focus on metadata and workflow testing
- Skip file upload steps during development

### Production Environment
Set in production environment variables:
```env
VITE_ASSETS_MANDATORY=true
```

Benefits:
- Ensures users don't accidentally skip critical uploads
- Maintains data quality and completeness
- Prevents incomplete submissions

## Testing

### Test Mandatory Mode

1. Ensure `.env` has:
   ```env
   VITE_ASSETS_MANDATORY=true
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

3. Test scenarios:
   - Try to proceed from Step 1 without artwork → Should be blocked
   - Upload artwork → Should be able to proceed to Step 2
   - Try to proceed from Step 2 without audio files → Should be blocked
   - Upload audio for all tracks → Should be able to proceed to Step 3
   - Try to export without assets → Should show validation errors

### Test Optional Mode

1. Update `.env` to:
   ```env
   VITE_ASSETS_MANDATORY=false
   ```

2. Restart the application

3. Test scenarios:
   - Should be able to navigate through all steps without uploads
   - No visual warning indicators should appear
   - Export should work without asset files

## Troubleshooting

### Validation always fails even with uploads

**Issue**: Environment variable not being read correctly

**Solution**:
1. Ensure you restart the dev server after changing `.env`
2. Check that the variable is named exactly `VITE_ASSETS_MANDATORY`
3. Vite requires the `VITE_` prefix for environment variables

### Visual indicators not showing

**Issue**: Components not re-rendering

**Solution**:
1. Check browser console for errors
2. Ensure all imports are correct
3. Clear browser cache and restart dev server

### Still optional even when set to true

**Issue**: String comparison issue

**Solution**: The value should be the string `'true'` not boolean `true`:
```env
VITE_ASSETS_MANDATORY=true
```

## File Structure

```
/src
  /lib
    assetValidation.ts       # Core validation logic
  /components
    ReleaseInfo.tsx          # Artwork validation UI
    ExportStep.tsx           # Export validation
    /track
      TrackMetadataSection.tsx  # Audio file validation UI
  /pages
    Index.tsx                # Main workflow with validation

/.env.example                # Template environment file
/.env                        # Local environment configuration (gitignored)
```

## Future Enhancements

Potential improvements:
- File size validation (min/max)
- File format validation (ensure correct types)
- Image dimension validation for artwork
- Audio quality validation (bit rate, sample rate)
- Custom validation messages per environment
- Configurable validation rules via config file
